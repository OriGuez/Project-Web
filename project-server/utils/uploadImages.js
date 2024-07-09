const multer = require('multer');
const path = require('path');

// Set up multer storage with absolute path
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../uploads/images'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type function
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|svg|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only - Unsupported File Type');
    }
}

// Initialize multer upload without file size limit
const uploadImage = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

module.exports = uploadImage;