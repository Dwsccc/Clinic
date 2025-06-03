const db = require('../models');
const User = db.User;

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, gender, birthdate, avatar_url } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.gender = gender ?? user.gender;
    user.birthdate = birthdate ?? user.birthdate;
    user.avatar_url = avatar_url ?? user.avatar_url;

    await user.save();

    res.json({ message: 'Cập nhật thông tin thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['createdAt', 'DESC']],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};
