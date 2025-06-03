const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkAdminRole } = require('../middlewares/role.middleware');
const { uploadDoctorImage } = require('../middlewares/uploadDoctor.middlewares');

// Tất cả route dưới đây yêu cầu: Đã đăng nhập + Là admin
router.use(verifyToken, checkAdminRole);

/**
 * @route   POST /api/admins/doctors
 * @desc    Tạo mới bác sĩ (có thể upload ảnh)
 */
router.post('/doctors', uploadDoctorImage.single('image'), adminController.createDoctor);

/**
 * @route   PUT /api/admins/doctors/:id
 * @desc    Cập nhật thông tin bác sĩ
 */
router.put('/doctors/:id', uploadDoctorImage.single('image'), adminController.updateDoctor);

/**
 * @route   DELETE /api/admins/doctors/:id
 * @desc    Xoá bác sĩ theo ID
 */
router.delete('/doctors/:id', adminController.deleteDoctor);

/**
 * @route   PATCH /api/admins/doctors/:id/toggle
 * @desc    Bật / Tắt trạng thái hoạt động của bác sĩ
 */
router.patch('/doctors/:id/toggle', adminController.toggleDoctorActive);

/**
 * @route   GET /api/admins/doctors
 * @desc    Lấy danh sách tất cả bác sĩ
 */
router.get('/doctors', adminController.getAllDoctors);

/**
 * @route   GET /api/admins/users
 * @desc    Lấy danh sách tất cả người dùng
 */
router.get('/users', adminController.getAllUsers);


router.get('/dashboard-stats', adminController.getDashboardStats);

/**
 * @route   DELETE /api/admins/users/:id
 * @desc    Xóa người dùng theo ID
 */
router.delete('/users/:id', adminController.deleteUser);


module.exports = router;
