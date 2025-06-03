const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Doctor = db.Doctor;
const Appointment = db.Appointment;

// Tạo tài khoản bác sĩ mới
exports.createDoctor = async (req, res) => {
  try {
    const {
      name, email, password, experience, fees,
      speciality, degree, address, about
    } = req.body;

    const avatar_url = req.file ? `/images/doctors/${req.file.filename}` : '';

    // Kiểm tra email đã tồn tại chưa
    const existing = await Doctor.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const password_hash = await bcrypt.hash(password, 10);

    const newDoctor = await Doctor.create({
      name,
      email,
      password_hash,
      experience,
      fees,
      speciality,
      degree,
      address,
      about,
      avatar_url,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo bác sĩ thành công',
      doctor: newDoctor
    });
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo bác sĩ',
      error: err.message,
      stack: err.stack
    });
  }
};

// Cập nhật thông tin bác sĩ
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    }

    const {
      name, experience, fees,
      speciality, degree, address, about
    } = req.body;

    const avatar_url = req.file ? `/images/doctors/${req.file.filename}` : doctor.avatar_url;

    // Cập nhật nếu có giá trị mới, không thì giữ nguyên
    doctor.avatar_url = avatar_url;
    doctor.name = name || doctor.name;
    doctor.experience = experience || doctor.experience;
    doctor.fees = fees || doctor.fees;
    doctor.speciality = speciality || doctor.speciality;
    doctor.degree = degree || doctor.degree;
    doctor.address = address || doctor.address;
    doctor.about = about || doctor.about;

    await doctor.save();

    res.json({ message: 'Cập nhật thông tin bác sĩ thành công', doctor });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi server khi cập nhật bác sĩ',
      error: err.message
    });
  }
};

// Xóa bác sĩ (có thể thêm kiểm tra tương tự nếu muốn)
exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    }

    // TODO: Kiểm tra ràng buộc nếu cần (ví dụ: có cuộc hẹn chưa hoàn tất thì không xóa)

    await doctor.destroy();
    res.json({ message: 'Xoá bác sĩ thành công' });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi server khi xoá bác sĩ',
      error: err.message
    });
  }
};

// Bật/tắt trạng thái hoạt động của bác sĩ
exports.toggleDoctorActive = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    }

    doctor.is_active = !doctor.is_active;
    await doctor.save();

    res.json({
      message: `Bác sĩ đã được ${doctor.is_active ? 'kích hoạt' : 'vô hiệu hoá'}`
    });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi server khi đổi trạng thái bác sĩ',
      error: err.message
    });
  }
};

// Lấy danh sách tất cả bác sĩ
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bác sĩ',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả người dùng (bỏ trường password_hash)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người dùng',
      error: error.message
    });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Đếm tổng số user và bác sĩ
    const totalUsers = await User.count();
    const totalDoctors = await Doctor.count();

    // 2. Lấy tất cả appointment
    const appointments = await Appointment.findAll({
      attributes: ['id', 'doctor_id', 'status', 'payment_status'],
      raw: true,
    });

    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
    const canceledAppointments = appointments.filter(a => a.status === 'cancelled').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

    // 3. Lấy fees của bác sĩ
    const doctors = await Doctor.findAll({
      attributes: ['id', 'fees'],
      raw: true,
    });

    // 4. Tạo map doctorId -> fees, parse kỹ
    const doctorFeesMap = {};
    doctors.forEach(doc => {
      const id = doc.id;
      const feeRaw = doc.fees;

      let fee = 0;
      if (typeof feeRaw === 'string') {
        fee = parseFloat(feeRaw.replace(/[^\d.]/g, '')) || 0;
      } else if (typeof feeRaw === 'number') {
        fee = feeRaw;
      }

      doctorFeesMap[id] = fee;
    });

    // 5. Tính tổng doanh thu từ các cuộc hẹn đã thanh toán
    let totalRevenue = 0;
    for (const appt of appointments) {
      const isPaid = (appt.payment_status || '').toLowerCase() === 'paid';
      const doctorId = appt.doctor_id;
      const fee = doctorFeesMap[doctorId];

      if (isPaid && typeof fee === 'number') {
        totalRevenue += fee;
      } else if (isPaid && typeof fee !== 'number') {
        console.warn(`❗️Doctor ${doctorId} has invalid fee: ${fee}`);
      }
    }

    // 6. Trả kết quả
    return res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        confirmedAppointments,
        canceledAppointments,
        pendingAppointments,
        totalRevenue,
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy thống kê dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dashboard',
      error: error.message
    });
  }
};


// Xóa người dùng — có kiểm tra nếu user còn cuộc hẹn chưa hoàn tất thì không xóa được
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra user còn cuộc hẹn chưa hủy hay chưa (status != canceled)
    const pendingAppointments = await Appointment.findOne({
      where: {
        user_id: userId,
        status: {
          [db.Sequelize.Op.not]: 'canceled',
        }
      }
    });

    if (pendingAppointments) {
      return res.status(400).json({
        message: 'Không thể xóa người dùng vì còn lịch hẹn chưa hoàn tất'
      });
    }

    await user.destroy();
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({
      message: 'Lỗi server khi xóa người dùng',
      error: err.message,
    });
  }
};
