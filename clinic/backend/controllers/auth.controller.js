const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Doctor, Admin } = require('../models');
const dotenv = require('dotenv');
dotenv.config();

// Đăng nhập cho User
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user'},  // thêm role 'user'
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

        res.json({
      message: 'Login successful',
      token,
      role: 'user',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        phone: user.phone,
        gender: user.gender,
        birthdate: user.birthdate,
        address: user.address
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// Đăng ký cho User
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: 'user' }, // thêm role
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User created successfully', token, role: 'user' });
  } catch (error) {
    console.error('ĐĂNG KÝ LỖI:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đăng nhập cho Admin
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, message: 'Login successful', token, role: 'admin' });
  } catch (error) {
    console.error('Lỗi đăng nhập admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đăng nhập cho Doctor
const doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const isMatch = await bcrypt.compare(password, doctor.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: 'doctor',success: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, role: 'doctor', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  userLogin,
  userRegister,
  adminLogin,
  doctorLogin,
};
