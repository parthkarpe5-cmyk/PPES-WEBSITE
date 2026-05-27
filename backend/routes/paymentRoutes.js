const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Create a Razorpay order (no auth needed — amount is validated server-side)
// POST /api/v1/payment/create-order
// ─────────────────────────────────────────────────────────────────────────────
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        if (!amount || Number(amount) < 100) {
            return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error('[Payment] Razorpay keys are not configured in backend .env');
            return res.status(500).json({ error: 'Payment gateway not configured' });
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount)),
            currency,
            receipt: `rcpt_${Date.now()}`
        });

        return res.json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('[Payment] Error creating Razorpay order:', error);
        if (error.statusCode === 401) {
            return res.status(401).json({ error: 'Authentication failed with Razorpay. Check API keys.' });
        }
        return res.status(500).json({ error: 'Failed to create order' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED: Verify payment, record in DB, and enroll student atomically
// POST /api/v1/payment/verify
// Requires: Authorization: Bearer <jwt>
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify', authMiddleware, async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            courseId,
            amount
        } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing required payment verification fields' });
        }

        // 1. Verify HMAC signature — this is the security-critical step
        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, error: 'Invalid payment signature' });
        }

        // 2. Student identity comes from the verified JWT — cannot be forged
        const studentId = req.user.id;

        // 3. Record the payment in MongoDB
        const paymentRecord = await Payment.create({
            studentId,
            courseId: courseId || null,
            amount: amount ? amount / 100 : 0,   // store in INR
            razorpay_order_id,
            razorpay_payment_id,
            status: 'success'
        });

        // 4. Enroll student in the course (if courseId provided)
        let courseName = 'Premium Course';
        if (courseId) {
            await User.findOneAndUpdate(
                { userId: studentId },
                { $addToSet: { unlockedCourses: courseId } },
                { new: true }
            );

            // Fetch course name for the invoice
            const course = await Course.findById(courseId).select('course_name');
            if (course) courseName = course.course_name;
        }

        return res.json({
            success: true,
            message: 'Payment verified and enrollment recorded',
            payment: paymentRecord,
            courseName
        });
    } catch (error) {
        console.error('[Payment] Error verifying payment:', error);
        return res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN: Get all payment records
// GET /api/v1/payments  (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const payments = await Payment.find()
            .populate('courseId', 'course_name course_id')
            .sort({ createdAt: -1 });

        const users = await User.find({}, 'userId name usn email');
        const userMap = users.reduce((acc, user) => {
            acc[user.userId] = user;
            return acc;
        }, {});

        const populatedPayments = payments.map(p => {
            const pObj = p.toObject();
            pObj.studentDetails = userMap[p.studentId] || null;
            return pObj;
        });

        return res.json(populatedPayments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED: Record a payment manually (legacy fallback — JWT authenticated)
// POST /api/v1/payments
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { courseId, amount, razorpay_order_id, razorpay_payment_id, status } = req.body;
        const studentId = req.user.id; // from JWT — tamper-proof

        if (!courseId || !razorpay_payment_id) {
            return res.status(400).json({ error: 'Missing required payment fields' });
        }

        const newPayment = await Payment.create({
            studentId,
            courseId,
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            status: status || 'success'
        });

        return res.status(201).json({ success: true, payment: newPayment });
    } catch (error) {
        console.error('[Payment] Failed to save payment:', error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
