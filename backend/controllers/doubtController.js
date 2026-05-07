const Doubt = require('../models/Doubt');
const Message = require('../models/Message');
const User = require('../models/User');

const createDoubt = async (req, res, next) => {
  try {
    const { title, initial_message, subject_id, teacher_id } = req.body;
    const student_id = req.user.id;

    if (req.user.role !== 'student') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Only students can create doubts'
        });
    }

    if (
      !title ||
      !initial_message ||
      (!initial_message.text && !initial_message.image_url) ||
      !subject_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: title, subject_id, and message content'
      });
    }

    const newDoubt = new Doubt({
      title,
      subject_id,
      student_id,
      assigned_teacher_id: teacher_id || null,
      status: 'open'
    });

    const savedDoubt = await newDoubt.save();

    const newMessage = new Message({
      doubt_id: savedDoubt._id,
      sender_id: student_id,
      text: initial_message.text || '',
      image_url: initial_message.image_url || null
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      doubt: savedDoubt,
      initial_message: savedMessage
    });
  } catch (error) {
    next(error);
  }
};

const getDoubtsList = async (req, res, next) => {
  try {
    let query = {};
    const { subject_id, teacher_id, grade } = req.query;

    // If the requester is a student, only return their doubts
    if (req.user.role === 'student') {
      query.student_id = req.user.id;
    }

    // If the requester is a faculty, only return doubts assigned to them
    if (req.user.role === 'faculty') {
      query.assigned_teacher_id = req.user.id;
    }

    // Allow optional filtering by subject_id
    if (subject_id) {
      query.subject_id = subject_id;
    }

    // Allow optional filtering by teacher_id (admin or other callers)
    if (teacher_id) {
      query.assigned_teacher_id = teacher_id;
    }

    let doubts = await Doubt.find(query).sort({ updated_at: -1 }).lean().exec();

    // Enrich with student details (name, grade)
    const enrichedDoubts = await Promise.all(doubts.map(async (doubt) => {
      // Use case-insensitive find just in case, though they should be consistent
      const student = await User.findOne({ userId: doubt.student_id }, 'name grade image');
      
      // Check for unread messages (sent by the OTHER person)
      // We treat is_read: false OR is_read: undefined as unread
      const unreadCount = await Message.countDocuments({
        doubt_id: doubt._id,
        sender_id: { $ne: req.user.id },
        is_read: { $ne: true }
      });

      return {
        ...doubt,
        student_name: student?.name || `Student (${doubt.student_id})`,
        student_grade: student?.grade || 'No Class',
        student_image: student?.image || '',
        has_unread: unreadCount > 0
      };
    }));

    // Apply grade filter if provided (filtering in memory since grade is on User model)
    let finalDoubts = enrichedDoubts;
    if (grade) {
      finalDoubts = enrichedDoubts.filter(d => d.student_grade === grade);
    }

    res.status(200).json({ success: true, data: finalDoubts });
  } catch (error) {
    next(error);
  }
};

const getDoubtDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id);

    if (!doubt) {
      return res
        .status(404)
        .json({ success: false, message: 'Doubt not found' });
    }

    // Enforce access control
    if (req.user.role === 'student' && doubt.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to doubt'
      });
    }

    if (
      req.user.role === 'faculty' &&
      doubt.assigned_teacher_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to doubt'
      });
    }

    const messages = await Message.find({ doubt_id: id })
      .sort({ created_at: 1 })
      .exec();

    // Mark messages as read (those sent by others)
    await Message.updateMany(
      { doubt_id: id, sender_id: { $ne: req.user.id }, is_read: false },
      { $set: { is_read: true } }
    );

    res.status(200).json({
      success: true,
      doubt,
      messages
    });
  } catch (error) {
    next(error);
  }
};

const updateDoubtStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: open, resolved, or closed'
      });
    }

    const doubt = await Doubt.findById(id);

    if (!doubt) {
      return res
        .status(404)
        .json({ success: false, message: 'Doubt not found' });
    }

    // Allow student to update or teacher with validation flag
    if (
      req.user.role === 'student' &&
      doubt.student_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this doubt'
      });
    }

    if (
      req.user.role === 'faculty' &&
      doubt.assigned_teacher_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this doubt'
      });
    }

    doubt.status = status;
    const updated = await doubt.save();

    res.status(200).json({ success: true, doubt: updated });
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
