const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

// Create a new test
exports.createTest = async (req, res) => {
    try {
        const { title, description, durationMinutes, passingScore, postTestMessage, isManualRelease, questions, courseId } = req.body;
        
        const newTest = new Test({
            title,
            description,
            durationMinutes,
            passingScore,
            postTestMessage,
            isManualRelease,
            courseId,
            questions,
            createdBy: req.user ? req.user.id : null // Assuming auth middleware sets req.user
        });

        await newTest.save();
        res.status(201).json({ message: 'Test created successfully', test: newTest });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all tests
exports.getTests = async (req, res) => {
    try {
        const query = {};
        if (req.query.courseId) query.courseId = req.query.courseId;
        
        const tests = await Test.find(query).select('-questions.correctAnswer'); // Don't send correct answers to list view
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get test by ID (without answers for students unless includeAnswers=true is specified)
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ error: 'Test not found' });

        const testObj = test.toObject();
        if (req.query.includeAnswers !== 'true') {
            testObj.questions.forEach(q => {
                delete q.correctAnswer;
            });
        }

        res.status(200).json(testObj);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit a test attempt
exports.submitAttempt = async (req, res) => {
    try {
        const { id: testId } = req.params;
        const { answers } = req.body; // Array of { questionId, value }
        
        // Use a mock student ID if req.user is undefined (since auth is bypassed currently)
        const studentId = req.user ? req.user.id : '000000000000000000000000';

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ error: 'Test not found' });

        let score = 0;
        let maxScore = 0;
        let requiresManualReview = false;

        const processedAnswers = answers.map(submittedAnswer => {
            const question = test.questions.id(submittedAnswer.questionId);
            if (!question) return submittedAnswer;

            maxScore += question.points;

            if (question.type === 'MCQ') {
                if (String(submittedAnswer.value) === String(question.correctAnswer)) {
                    score += question.points;
                }
            } else if (question.type === 'MULTIPLE_SELECT') {
                // Sort arrays to compare
                const submittedArr = Array.isArray(submittedAnswer.value) ? [...submittedAnswer.value].sort() : [];
                const correctArr = Array.isArray(question.correctAnswer) ? [...question.correctAnswer].sort() : [];
                if (JSON.stringify(submittedArr) === JSON.stringify(correctArr)) {
                    score += question.points;
                }
            } else if (question.type === 'DESCRIPTIVE' || question.type === 'CODING') {
                requiresManualReview = true;
            }

            return submittedAnswer;
        });

        const attempt = new TestAttempt({
            testId,
            studentId,
            answers: processedAnswers,
            score,
            maxScore,
            status: requiresManualReview ? 'pending_review' : 'completed'
        });

        await attempt.save();

        res.status(201).json({ 
            message: 'Test submitted successfully', 
            score, 
            maxScore, 
            status: attempt.status,
            postTestMessage: test.postTestMessage
        });
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get attempts for a user
exports.getMyAttempts = async (req, res) => {
    try {
        const studentId = req.user ? req.user.id : '000000000000000000000000';
        const attempts = await TestAttempt.find({ studentId }).populate('testId', 'title durationMinutes');
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update an existing test
exports.updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, durationMinutes, passingScore, postTestMessage, isManualRelease, questions } = req.body;

        const updatedTest = await Test.findByIdAndUpdate(
            id,
            {
                title,
                description,
                durationMinutes,
                passingScore,
                postTestMessage,
                isManualRelease,
                questions
            },
            { new: true }
        );

        if (!updatedTest) return res.status(404).json({ error: 'Test not found' });

        res.status(200).json({ message: 'Test updated successfully', test: updatedTest });
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
