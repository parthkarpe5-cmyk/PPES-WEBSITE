const Message = require('../models/Message');
const Doubt = require('../models/Doubt');

const addMessage = async (req, res, next) => {
  try {
    const { doubt_id, text, image_url } = req.body;
    const sender_id = req.user.id;

    if (!doubt_id || (!text && !image_url)) {
      return res.status(400).json({
        success: false,
        message: 'doubt_id and at least one of text/image_url are required'
      });
    }

    // Verify doubt exists
    const doubt = await Doubt.findById(doubt_id);
    if (!doubt) {
      return res
        .status(404)
        .json({ success: false, message: 'Doubt not found' });
    }

    // Verify access: sender is student/teacher of this doubt
    console.log('[Debug] AddMessage - Sender:', sender_id);
    console.log('[Debug] AddMessage - Doubt Student:', doubt.student_id);
    console.log('[Debug] AddMessage - Doubt Teacher:', doubt.assigned_teacher_id);

    if (
      doubt.student_id !== sender_id &&
      doubt.assigned_teacher_id !== sender_id
    ) {
      console.warn('[Debug] AddMessage - UNAUTHORIZED');
      return res.status(403).json({
        success: false,
        message: `Unauthorized to add message. Sender ${sender_id} is neither student ${doubt.student_id} nor teacher ${doubt.assigned_teacher_id}`
      });
    }

    const newMessage = new Message({
      doubt_id,
      sender_id,
      text: text || '',
      image_url: image_url || null
    });

    const savedMessage = await newMessage.save();

    // Update doubt's updated_at timestamp
    doubt.updated_at = new Date();
    await doubt.save();

    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMessage
};
