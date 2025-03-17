const fs = require('fs');
const path = require('path');

const ensureUploadDirs = () => {
    const dirs = [
        '/public/uploads',
        '/public/uploads/audio',
        '/public/uploads/attachments',
        '/public/uploads/recordings'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

module.exports = ensureUploadDirs; 