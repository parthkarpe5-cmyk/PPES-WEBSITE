const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material');
const Subject = require('../models/Subject');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a material (upload file)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, subjectId, type } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;

    const material = await Material.create({ 
      title, 
      subjectId, 
      url, 
      type: type || 'PDF' 
    });
    
    // Add to subject
    await Subject.findByIdAndUpdate(subjectId, { $push: { materials: material._id } });
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a material
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    
    // Remove from subject
    await Subject.findByIdAndUpdate(material.subjectId, { $pull: { materials: material._id } });
    
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
