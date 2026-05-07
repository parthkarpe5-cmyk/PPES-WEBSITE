const { getSubjects, getTeachers } = require('../utils/storage');

const getSubjectsList = async (req, res, next) => {
    try {
        const subjects = await getSubjects();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        next(error);
    }
};

const getTeachersForSubject = async (req, res, next) => {
    try {
        const { subjectId } = req.params;
        const subjects = await getSubjects();
        const subject = subjects.find(s => s.id === subjectId);

        if (!subject) {
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        const teachers = await getTeachers();
        const subjectTeachers = teachers.filter(t => subject.teachers.includes(t.id));

        res.status(200).json({ 
            success: true, 
            subject,
            data: subjectTeachers 
        });
    } catch (error) {
        next(error);
    }
};

const getAllTeachers = async (req, res, next) => {
    try {
        const teachers = await getTeachers();
        res.status(200).json({ success: true, data: teachers });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSubjectsList,
    getTeachersForSubject,
    getAllTeachers
};
