const db = require('../models');
const Notification = db.Notification;

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        user_id: req.user.id // user đã đăng nhập
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông báo', error });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);

    if (!notification || notification.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Không được phép hoặc không tồn tại' });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error });
  }
};
