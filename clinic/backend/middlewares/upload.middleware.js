const multer = require('multer');
const path = require('path');

// Cấu hình lưu file vào ./public/images/users
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/users'));
  },
  filename: function (req, file, cb) {
    // Đặt tên file: userId + thời gian + phần mở rộng file
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Kiểm tra file upload có phải ảnh không (tuỳ chọn)
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload ảnh (jpeg, jpg, png, gif)'));
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
