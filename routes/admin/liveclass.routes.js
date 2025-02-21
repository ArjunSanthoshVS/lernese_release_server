const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const liveclassController = require('../../controllers/admin/liveclassController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/recordings/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size
  }
});

// Get all live classes with status filter
router.get('/classes', verifyToken, liveclassController.getAllClasses);

// Get specific class details
router.get('/classes/:id', verifyToken, liveclassController.getClassDetails);

// Create a new class
router.post('/classes', verifyToken, liveclassController.createClass);

// Update class details
router.put('/classes/:id', verifyToken, liveclassController.updateClass);

// Cancel/Delete a class
router.delete('/classes/:id', verifyToken, liveclassController.cancelClass);

// Get class analytics
router.get('/classes/:id/analytics', verifyToken, liveclassController.getClassAnalytics);

// Upload class recording
router.post('/classes/upload-recording', verifyToken, upload.single('recording'), liveclassController.uploadRecording);

module.exports = router; 