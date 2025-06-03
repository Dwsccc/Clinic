const db = require('../models');
const Appointment = db.Appointment;
const Doctor = db.Doctor;
const User = db.User;

exports.bookAppointment = async (req, res) => {
  try {
    const { doctor_id, start_time, note } = req.body;

    // Validate dữ liệu đầu vào cơ bản
    if (!doctor_id || !start_time) {
      return res.status(400).json({ message: 'doctor_id và start_time là bắt buộc' });
    }

    // Kiểm tra bác sĩ có tồn tại không
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Bác sĩ không tồn tại' });
    }

    // Kiểm tra trùng lịch với các lịch đã xác nhận
    const existingConfirmed = await Appointment.findOne({
      where: {
        doctor_id,
        start_time,
        status: 'confirmed'
      }
    });

    if (existingConfirmed) {
      return res.status(400).json({ message: 'Khung giờ này đã có người đặt lịch xác nhận rồi.' });
    }

    // Nếu không trùng thì tiếp tục đặt lịch (trạng thái pending)
    const appointment = await Appointment.create({
      user_id: req.user.id,
      doctor_id,
      start_time,
      note,
      status: 'pending'
    });

    res.status(201).json({ message: 'Đặt lịch thành công', appointment });
  } catch (err) {
    console.error('Lỗi bookAppointment:', err);
    res.status(500).json({ message: 'Lỗi server khi đặt lịch', error: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'speciality', 'avatar_url', 'address', 'fees'],
        },
      ],
      order: [['start_time', 'DESC']],
    });

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('Lỗi getUserAppointments:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch hẹn của người dùng', error: err.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctor_id: req.user.id },
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['start_time', 'DESC']],
    });

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('Lỗi getDoctorAppointments:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch hẹn của bác sĩ', error: err.message });
  }
};
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    // Nếu lịch đã confirmed thì không cho thay đổi trạng thái nữa
    if (appointment.status === 'confirmed') {
      return res.status(400).json({ message: 'Lịch hẹn đã được xác nhận, không thể thay đổi trạng thái.' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Cập nhật trạng thái thành công', appointment });
  } catch (err) {
    console.error('Lỗi updateAppointmentStatus:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái', error: err.message });
  }
};


exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['start_time', 'DESC']],
      attributes: [
        'id',
        'user_id',
        'doctor_id',
        'start_time',
        'status',
        'note',
        'payment_status',
        'createdAt',
        'updatedAt'
      ],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'speciality'] }
      ]
    });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Lỗi getAllAppointments:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy tất cả lịch hẹn', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    }

    // Kiểm tra trạng thái, nếu đã xác nhận thì không cho xóa
    if (appointment.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Lịch hẹn đã xác nhận không thể xóa' });
    }

    await appointment.destroy();

    return res.json({ success: true, message: 'Xoá lịch hẹn thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa lịch hẹn', error: error.message });
  }
};


exports.getConfirmedTimes = async (req, res) => {
  try {
    const confirmedAppointments = await Appointment.findAll({
      where: { status: "confirmed" },
      attributes: ["start_time"],
      order: [["start_time", "ASC"]],
    });

    res.json({
      success: true,
      confirmedTimes: confirmedAppointments.map(ap => ({
        start_time: ap.start_time,
      })),
    });
  } catch (error) {
    console.error("Lỗi khi lấy thời gian đã xác nhận:", error);
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};
