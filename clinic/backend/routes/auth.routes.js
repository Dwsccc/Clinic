// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User
router.post('/user/register', authController.userRegister);
router.post('/user/login', authController.userLogin);

// Admin
router.post('/admin/login', authController.adminLogin);

// Doctor
router.post('/doctor/login', authController.doctorLogin);

module.exports = router;
