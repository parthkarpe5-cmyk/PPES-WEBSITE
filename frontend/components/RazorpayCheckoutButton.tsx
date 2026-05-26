'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  amount?: number; // amount in paise (default 100)
  courseId?: string | null;
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RazorpayCheckoutButton({ amount = 100, courseId }: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getJwtToken = (): string => {
    return Cookies.get('token') || '';
  };

  const generateInvoice = (
    paymentId: string,
    orderId: string,
    studentName: string,
    courseName: string,
    amt: number
  ) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(47, 168, 204);
    doc.text('PPES Classroom', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Official Course Invoice', 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    // Billing & Transaction Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Billed To:', 14, 50);
    doc.setFontSize(10);
    doc.text(`Student: ${studentName}`, 14, 56);

    doc.setFontSize(12);
    doc.text('Payment Details:', 120, 50);
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${paymentId}`, 120, 56);
    doc.text(`Order ID: ${orderId}`, 120, 62);
    doc.text('Status: Paid', 120, 68);

    // Line-item table
    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Amount (INR)']],
      body: [[`Enrollment: ${courseName}`, `Rs. ${(amt / 100).toFixed(2)}`]],
      headStyles: { fillColor: [47, 168, 204] },
      theme: 'striped',
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Paid: Rs. ${(amt / 100).toFixed(2)}`, 140, finalY + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('Thank you for choosing PPES. Happy Learning!', 14, finalY + 40);

    doc.save(`invoice_${paymentId}.pdf`);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');

    try {
      // ── Step 1: Create order on Express backend (no secret exposed to browser) ──
      const orderRes = await fetch(`${BACKEND}/api/v1/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      // ── Step 2: Load Razorpay checkout script ──
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      // ── Step 3: Open Razorpay modal ──
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PPES Learning',
        description: 'Course Enrollment',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // ── Step 4: Verify on Express (atomic: verify + record + enroll) ──
            const jwtToken = getJwtToken();
            const verifyRes = await fetch(`${BACKEND}/api/v1/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
              credentials: 'include', // also send cookies as fallback
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                amount,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setMessage('Payment successful! Generating invoice...');

              // Get student name from cookie for the invoice
              let studentName = 'Student';
              try {
                const userData = JSON.parse(Cookies.get('user-data') || '{}');
                studentName = userData.name || 'Student';
              } catch (_) {}

              const courseName = verifyData.courseName || 'Premium Course';

              // ── Step 5: Generate invoice client-side (no sensitive data) ──
              generateInvoice(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                studentName,
                courseName,
                amount
              );

              setMessage('Enrollment successful! Redirecting...');
              setTimeout(() => { window.location.href = '/student'; }, 3000);
            } else {
              setMessage(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            console.error('[Payment] Verification error:', err);
            setMessage('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: { color: '#2FA8CC' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('[Payment] Failed:', response.error);
        setMessage(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      console.error('[Payment] Error:', error);
      setMessage(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        id="razorpay-pay-button"
        onClick={handlePayment}
        disabled={loading}
        className="group relative px-10 py-4 bg-gradient-to-r from-[#2FA8CC] to-[#1a7fa0] text-white font-black rounded-2xl text-lg shadow-xl shadow-[#2FA8CC]/30 hover:shadow-[#2FA8CC]/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
      >
        <span className="relative z-10 flex items-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay ₹{(amount / 100).toLocaleString('en-IN')}
            </>
          )}
        </span>
      </button>
      {message && (
        <p className={`text-sm font-semibold px-4 py-2 rounded-xl ${
          message.includes('successful') || message.includes('Redirecting')
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
