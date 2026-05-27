const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { parseCSV, parseTXT, validateAndResolveQuestion } = require('../utils/testParser');

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

// Delete an existing test and its attempts
exports.deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTest = await Test.findByIdAndDelete(id);
        if (!deletedTest) return res.status(404).json({ error: 'Test not found' });

        // Delete all associated attempts
        await TestAttempt.deleteMany({ testId: id });

        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Import questions from CSV, TXT, or DOCX
exports.importTest = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        let rawText = '';
        let parsedQuestions = [];

        if (ext === '.csv') {
            rawText = fs.readFileSync(filePath, 'utf8');
            parsedQuestions = parseCSV(rawText);
        } else if (ext === '.txt') {
            rawText = fs.readFileSync(filePath, 'utf8');
            parsedQuestions = parseTXT(rawText);
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            rawText = result.value;
            parsedQuestions = parseTXT(rawText);
        } else {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file extension. Only CSV, TXT, and DOCX are allowed.' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Validate and resolve each question
        const validatedQuestions = parsedQuestions.map((q, idx) => validateAndResolveQuestion(q, idx));

        // Extract a fallback title from the filename
        const baseName = path.basename(req.file.originalname, ext);
        const title = baseName.replace(/[-_]/g, ' ')
                              .replace(/\b\w/g, c => c.toUpperCase()) + ' (Imported)';

        res.status(200).json({
            success: true,
            title,
            description: `Imported from ${req.file.originalname} on ${new Date().toLocaleDateString()}`,
            questions: validatedQuestions
        });
    } catch (error) {
        console.error('Error during test import:', error);
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Internal server error during parsing.' });
    }
};

// Get all attempts for a specific test (faculty review dashboard)
exports.getTestAttempts = async (req, res) => {
    try {
        const { id: testId } = req.params;

        // Verify the test exists
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ error: 'Test not found' });

        const attempts = await TestAttempt.find({ testId })
            .sort({ createdAt: -1 })
            .lean();

        // Populate student name/usn from User collection (best-effort)
        const User = require('../models/User');
        const populatedAttempts = await Promise.all(
            attempts.map(async (attempt) => {
                const student = await User.findById(attempt.studentId)
                    .select('name usn userId')
                    .lean()
                    .catch(() => null);
                return {
                    ...attempt,
                    student: student || { name: 'Unknown Student', usn: '—', userId: '—' }
                };
            })
        );

        res.status(200).json({ test, attempts: populatedAttempts });
    } catch (error) {
        console.error('Error fetching test attempts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Grade a specific attempt (faculty submits manual marks per question)
exports.gradeAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        // manualMarks: [{ questionId, mark }]
        const { manualMarks, gradedBy } = req.body;

        if (!Array.isArray(manualMarks) || manualMarks.length === 0) {
            return res.status(400).json({ error: 'manualMarks array is required' });
        }

        const attempt = await TestAttempt.findById(attemptId);
        if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

        // Fetch the associated test to get auto-graded scores & question max points
        const test = await Test.findById(attempt.testId);
        if (!test) return res.status(404).json({ error: 'Associated test not found' });

        // Build a map of questionId -> manualMark from the request
        const markMap = {};
        for (const item of manualMarks) {
            markMap[String(item.questionId)] = Number(item.mark);
        }

        // Apply manual marks to the attempt's answers
        let autoScore = 0;
        let manualScore = 0;

        for (const answer of attempt.answers) {
            const qId = String(answer.questionId);
            const question = test.questions.id(answer.questionId);
            if (!question) continue;

            if (question.type === 'DESCRIPTIVE' || question.type === 'CODING') {
                // Faculty-provided mark — clamp to [0, maxPoints]
                if (markMap[qId] !== undefined) {
                    const clamped = Math.min(Math.max(markMap[qId], 0), question.points);
                    answer.manualMark = clamped;
                    manualScore += clamped;
                } else if (answer.manualMark !== null && answer.manualMark !== undefined) {
                    // Keep existing mark if not updated
                    manualScore += answer.manualMark;
                }
            } else {
                // MCQ / MULTIPLE_SELECT — recalculate auto score
                if (question.type === 'MCQ') {
                    if (String(answer.value) === String(question.correctAnswer)) {
                        autoScore += question.points;
                    }
                } else if (question.type === 'MULTIPLE_SELECT') {
                    const subArr = Array.isArray(answer.value) ? [...answer.value].sort() : [];
                    const corArr = Array.isArray(question.correctAnswer) ? [...question.correctAnswer].sort() : [];
                    if (JSON.stringify(subArr) === JSON.stringify(corArr)) {
                        autoScore += question.points;
                    }
                }
            }
        }

        // Check if all manual questions have now been graded
        const hasUngraded = attempt.answers.some((ans) => {
            const q = test.questions.id(ans.questionId);
            return q && (q.type === 'DESCRIPTIVE' || q.type === 'CODING') && ans.manualMark === null;
        });

        attempt.score = autoScore + manualScore;
        attempt.status = hasUngraded ? 'pending_review' : 'completed';
        attempt.gradedBy = gradedBy || 'faculty';
        attempt.gradedAt = new Date();

        await attempt.save();

        res.status(200).json({
            message: hasUngraded ? 'Partial grades saved.' : 'Attempt fully graded and marked as completed.',
            score: attempt.score,
            maxScore: attempt.maxScore,
            status: attempt.status
        });
    } catch (error) {
        console.error('Error grading attempt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
