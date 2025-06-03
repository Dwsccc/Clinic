const db = require('../models');
const Doctor = db.Doctor;
const Appointment = db.Appointment;
const User = db.User;
const { Sequelize } = require('sequelize');

exports.getDoctorProfile = async (req, res) => {
  try {
    console.log("req.doctor:", req.doctor);
    const doctor = await Doctor.findByPk(req.doctor.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!doctor) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });

    res.json({doctor,success: true});
  } catch (err) {
    console.error('Lỗi khi lấy profile bác sĩ:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findByPk(doctorId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    // Lấy dữ liệu cập nhật từ body
    const updateData = { ...req.body };

    // Nếu có file ảnh upload, thêm avatar_url vào updateData
    if (req.file) {
      updateData.avatar_url = `/images/doctors/${req.file.filename}`;
    }

    // Tìm bác sĩ theo id (giả sử id lưu trong req.user.id hoặc req.doctor.id)
    const doctorId = req.user?.id || req.doctor?.id;
    if (!doctorId) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    }

    // Cập nhật dữ liệu (chỉ ghi đè các field có trong updateData)
    Object.assign(doctor, updateData);

    await doctor.save();

    res.json({ message: 'Cập nhật thông tin thành công', doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { is_active: true },
      attributes: { exclude: ['password_hash'] },
      order: [['experience', 'DESC']]
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const totalAppointments = await Appointment.count({
      where: { doctor_id: doctorId }
    });

    const totalPatientsResult = await Appointment.findAll({
      where: { doctor_id: doctorId },
      attributes: [[Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), 'count']]
    });
    const totalPatients = totalPatientsResult[0].get('count');

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });

    const totalPaidAppointments = await Appointment.count({
      where: {
        doctor_id: doctorId,
        payment_status: 'paid'
      }
    });

    const totalRevenue = parseFloat(doctor.fees) * totalPaidAppointments;

    res.json({
      success: true,
      stats: {
        totalAppointments,
        totalPatients,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor.id;

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'gender', 'birthdate', 'avatar_url']
        }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json({
      success: true,
      appointments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
