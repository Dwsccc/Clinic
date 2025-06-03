const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkDoctorRole } = require('../middlewares/role.middleware'); // Sử dụng middleware checkDoctorRole
const { uploadDoctorImage } = require('../middlewares/uploadDoctor.middlewares');

// Lấy thông tin cá nhân của bác sĩ
router.get('/me', verifyToken, checkDoctorRole, doctorController.getDoctorProfile);

// Cập nhật thông tin bác sĩ
router.put('/me', verifyToken, checkDoctorRole, uploadDoctorImage.single('image'), doctorController.updateDoctorProfile);

// Lấy danh sách bác sĩ (cho bệnh nhân lọc, không cần auth)
router.get('/', doctorController.getAllDoctors);

router.get('/dashboard', verifyToken, checkDoctorRole, doctorController.getDashboardStats);
router.get('/appointments', verifyToken, checkDoctorRole, doctorController.getAppointments);

// Lấy thông tin bác sĩ theo ID
router.get('/:id', doctorController.getDoctorById);


module.exports = router;
