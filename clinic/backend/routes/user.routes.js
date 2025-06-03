const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkAdminRole } = require('../middlewares/role.middleware'); // Thêm middleware kiểm tra admin
const upload = require('../middlewares/upload.middleware');

// Lấy thông tin cá nhân người dùng
router.get('/me', verifyToken, userController.getProfile);

// Cập nhật thông tin cá nhân
router.put('/me', verifyToken, userController.updateProfile);

// (Tuỳ chọn) Lấy danh sách tất cả người dùng (chỉ cho admin)
router.get('/', verifyToken, checkAdminRole, userController.getAllUsers);

router.post('/register', authController.userRegister);

// Route upload ảnh avatar
router.post('/upload-avatar', verifyToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }
    // Trả về đường dẫn URL của ảnh
    const imageUrl = `/images/users/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
