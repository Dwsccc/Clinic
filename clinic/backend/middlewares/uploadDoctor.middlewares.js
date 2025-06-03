const multer = require('multer');
const path = require('path');

// ========== Upload ảnh người dùng ==========
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/users'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${req.user?.id || 'user'}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const uploadUserImage = multer({
  storage: userStorage,
  fileFilter: imageFileFilter
});


// ========== Upload ảnh bác sĩ ==========
const doctorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/doctors'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${req.body?.name?.replace(/\s+/g, '_') || 'doctor'}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const uploadDoctorImage = multer({
  storage: doctorStorage,
  fileFilter: imageFileFilter
});


// ========== Bộ lọc file ảnh ==========
function imageFileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload ảnh (jpeg, jpg, png, gif)'));
  }
}


// ========== Export ==========
module.exports = {
  uploadUserImage,
  uploadDoctorImage
};
