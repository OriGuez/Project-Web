const multer = require('multer');
const path = require('path');

// Set up multer storage with dynamic destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        if (file.fieldname === 'video') {
            uploadPath = path.resolve(__dirname, '../uploads/videos');
        } else if (file.fieldname === 'image') {
            uploadPath = path.resolve(__dirname, '../uploads/images');
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type function
function checkFileType(file, cb) {
    let filetypes;
    if (file.fieldname === 'video') {
        filetypes = /mp4|avi|mkv|mov/;
    } else if (file.fieldname === 'image') {
        filetypes = /jpeg|jpg|png|gif/;
    }

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(`Error: Unsupported File Type for ${file.fieldname}`);
    }
}

// Initialize multer upload to handle both video and image
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]);

module.exports = upload;