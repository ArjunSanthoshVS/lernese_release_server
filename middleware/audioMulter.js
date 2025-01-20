const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for audio files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/uploads/audio');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        console.log('Upload path:', uploadPath);
        console.log('File to be saved:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        console.log('Processing file for filename:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Get original file extension or default to .m4a
        const ext = path.extname(file.originalname) || '.m4a';
        const filename = `${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

// File filter for audio files
const fileFilter = (req, file, cb) => {
    console.log('Received file in filter:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype
    });

    // Accept any audio file or octet-stream (some devices send this)
    if (file.mimetype.startsWith('audio/') || 
        file.mimetype === 'application/octet-stream' ||
        file.fieldname === 'audio') {  // Also accept if the field name is 'audio'
        console.log('File type accepted:', file.mimetype);
        cb(null, true);
    } else {
        console.error('Invalid file type:', file.mimetype);
        cb(new Error(`Invalid audio file type: ${file.mimetype}`), false);
    }
};

// Create multer instance with error handling
const multerInstance = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        fieldSize: 50 * 1024 * 1024 // 50MB
    }
});

// Wrap multer middleware to add error handling
const audioMulter = (req, res, next) => {
    console.log('=== Processing Audio Upload ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    console.log('Available fields:', req.body);

    // Use .any() to see what fields are coming in
    multerInstance.any()(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                success: false,
                error: {
                    message: `Upload error: ${err.message}`,
                    code: err.code
                }
            });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({
                success: false,
                error: {
                    message: err.message,
                    code: 'UNKNOWN_ERROR'
                }
            });
        }
        
        console.log('After multer processing:');
        console.log('Files:', req.files);
        console.log('File:', req.file);
        console.log('Body:', req.body);

        // If we have files, move the first audio file to req.file
        if (req.files && req.files.length > 0) {
            const audioFile = req.files.find(f => f.fieldname === 'audio');
            if (audioFile) {
                req.file = audioFile;
            }
        }

        next();
    });
};

module.exports = audioMulter; 