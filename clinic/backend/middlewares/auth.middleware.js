const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Admin, Doctor } = db;

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;

    // Tùy role -> lấy đúng loại tài khoản
    if (decoded.role === 'user') {
      req.user = await User.findByPk(decoded.id);
    } else if (decoded.role === 'admin') {
      req.admin = await Admin.findByPk(decoded.id);
    } else if (decoded.role === 'doctor') {
      req.doctor = await Doctor.findByPk(decoded.id);
    }

    if (!req.user && !req.admin && !req.doctor) {
      return res.status(404).json({ message: 'Account not found!' });
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized! Invalid token.' });
    }
    return res.status(500).json({ message: 'Server error!' });
  }
};

module.exports = { verifyToken };
