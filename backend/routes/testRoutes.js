const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file imports
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.csv', '.txt', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, TXT, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// For now, we omit auth middleware to make integration easier,
// but in a production app, routes would be protected.

router.post('/import', upload.single('file'), testController.importTest);
router.post('/', testController.createTest);
router.get('/', testController.getTests);
router.get('/attempts/me', testController.getMyAttempts);
router.patch('/attempts/:attemptId/grade', testController.gradeAttempt);
router.get('/:id', testController.getTestById);
router.get('/:id/attempts', testController.getTestAttempts);
router.put('/:id', testController.updateTest);
router.post('/:id/attempt', testController.submitAttempt);
router.delete('/:id', testController.deleteTest);

module.exports = router;

