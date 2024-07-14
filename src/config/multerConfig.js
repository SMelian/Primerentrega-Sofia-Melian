const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'others';
        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'document') {
            folder = 'documents';
        }
        cb(null, path.join(__dirname, `../uploads/${folder}`));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
