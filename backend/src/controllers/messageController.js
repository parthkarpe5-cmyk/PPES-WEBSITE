const { v4: uuidv4 } = require('uuid');
const { getMessages, saveMessages, getDoubts, saveDoubts } = require('../utils/storage');

const addMessage = async (req, res, next) => {
    try {
        const { doubt_id, text, image_url } = req.body;
        const sender_id = req.user.id;

        if (!doubt_id || (!text && !image_url)) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Verify doubt exists
        const doubts = await getDoubts();
        const doubtIndex = doubts.findIndex(d => d.id === doubt_id);
        if (doubtIndex === -1) {
            return res.status(404).json({ success: false, message: 'Doubt not found' });
        }

        const doubt = doubts[doubtIndex];

        // Enforce authorization
        if (req.user.role === 'student' && doubt.student_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const messages = await getMessages();

        const now = new Date().toISOString();
        const newMessage = {
            id: uuidv4(),
            doubt_id,
            sender_id,
            text: text || '',
            image_url: image_url || null,
            created_at: now,
        };

        messages.push(newMessage);
        await saveMessages(messages);

        // Update doubt's updated_at
        doubt.updated_at = now;
        if (req.user.role === 'teacher' && !doubt.assigned_teacher_id) {
            doubt.assigned_teacher_id = req.user.id;
        }
        await saveDoubts(doubts);

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addMessage
};
