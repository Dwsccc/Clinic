const { User, Admin, Doctor } = require('../models');

// Middleware phân quyền cho người dùng
exports.checkUserRole = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(403).json({ message: 'Not authorized. User required' });
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }
  next();
};

// Middleware phân quyền cho bác sĩ
exports.checkDoctorRole = async (req, res, next) => {
  if (!req.doctor || !req.doctor.id) {
    return res.status(403).json({ message: 'Not authorized. Doctor required' });
  }

  const doctor = await Doctor.findByPk(req.doctor.id);
  if (!doctor) {
    return res.status(403).json({ message: 'Doctor not found' });
  }

  next();
};

// Middleware phân quyền cho quản trị viên
exports.checkAdminRole = async (req, res, next) => {
  if (!req.admin || !req.admin.id) {
    return res.status(403).json({ message: 'Not authorized. Admin required' });
  }

  const admin = await Admin.findByPk(req.admin.id);
  if (!admin) {
    return res.status(403).json({ message: 'Admin not found' });
  }

  next();
};
