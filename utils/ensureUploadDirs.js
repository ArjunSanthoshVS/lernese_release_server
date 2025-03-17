const fs = require('fs');
const path = require('path');

const ensureUploadDirs = () => {
    const dirs = [
        path.join(__dirname, '../public/uploads'),
        path.join(__dirname, '../public/uploads/audio'),
        path.join(__dirname, '../public/uploads/attachments'),
        path.join(__dirname, '../public/uploads/recordings')
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

module.exports = ensureUploadDirs; 