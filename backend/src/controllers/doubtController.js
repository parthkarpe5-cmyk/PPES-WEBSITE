const { v4: uuidv4 } = require('uuid');
const { getDoubts, saveDoubts, getMessages, saveMessages } = require('../utils/storage');

const createDoubt = async (req, res, next) => {
    try {
        const { title, initial_message, subject_id, teacher_id } = req.body;
        const student_id = req.user.id;

        if (req.user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Only students can create doubts' });
        }

        if (!title || !initial_message || (!initial_message.text && !initial_message.image_url) || !subject_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields: title, subject_id, and message content' });
        }

        const doubts = await getDoubts();
        const messages = await getMessages();

        const now = new Date().toISOString();
        const newDoubt = {
            id: uuidv4(),
            student_id,
            subject_id,
            title,
            created_at: now,
            updated_at: now,
            status: 'open',
            assigned_teacher_id: teacher_id || null
        };

        const newMessage = {
            id: uuidv4(),
            doubt_id: newDoubt.id,
            sender_id: student_id,
            text: initial_message.text || '',
            image_url: initial_message.image_url || null,
            created_at: now,
        };

        doubts.push(newDoubt);
        messages.push(newMessage);

        await saveDoubts(doubts);
        await saveMessages(messages);

        res.status(201).json({ success: true, doubt: newDoubt, initial_message: newMessage });
    } catch (error) {
        next(error);
    }
};

const getDoubtsList = async (req, res, next) => {
    try {
        let doubts = await getDoubts();
        const { subject_id, teacher_id } = req.query;

        // If the requester is a student, only return their doubts
        if (req.user.role === 'student') {
            doubts = doubts.filter(d => d.student_id === req.user.id);
        }

        // If the requester is a teacher, only return doubts assigned to them
        if (req.user.role === 'teacher') {
            doubts = doubts.filter(d => d.assigned_teacher_id === req.user.id);
        }

        // Allow optional filtering by subject_id (useful for teachers to filter their assigned doubts)
        if (subject_id) {
            doubts = doubts.filter(d => d.subject_id === subject_id);
        }

        // Allow optional filtering by teacher_id (admin or other callers)
        if (teacher_id) {
            doubts = doubts.filter(d => d.assigned_teacher_id === teacher_id);
        }

        // Sort by updated_at desc
        doubts.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));

        res.status(200).json({ success: true, data: doubts });
    } catch (error) {
        next(error);
    }
};

const getDoubtDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const doubts = await getDoubts();
        const doubt = doubts.find(d => d.id === id);

        if (!doubt) {
            return res.status(404).json({ success: false, message: 'Doubt not found' });
        }

        // Enforce access control
        if (req.user.role === 'student' && doubt.student_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to doubt' });
        }

        const allMessages = await getMessages();
        const doubtMessages = allMessages.filter(m => m.doubt_id === id);
        
        doubtMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        res.status(200).json({
            success: true,
            doubt,
            messages: doubtMessages
        });
    } catch (error) {
        next(error);
    }
};

const updateDoubtStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['open', 'resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const doubts = await getDoubts();
        const doubtIndex = doubts.findIndex(d => d.id === id);

        if (doubtIndex === -1) {
            return res.status(404).json({ success: false, message: 'Doubt not found' });
        }

        const doubt = doubts[doubtIndex];

        if (req.user.role === 'student' && doubt.student_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        doubt.status = status;
        doubt.updated_at = new Date().toISOString();
        if (req.user.role === 'teacher' && !doubt.assigned_teacher_id) {
            doubt.assigned_teacher_id = req.user.id;
        }

        await saveDoubts(doubts);

        res.status(200).json({ success: true, data: doubt });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDoubt,
    getDoubtsList,
    getDoubtDetails,
    updateDoubtStatus
};
