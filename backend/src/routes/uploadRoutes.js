const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG and PNG are allowed.'));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        // Return a public URL
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, image_url: imageUrl });
    });
});

module.exports = router;
