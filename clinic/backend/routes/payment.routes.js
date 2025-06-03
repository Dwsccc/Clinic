// routes/payment.routes.js
const express = require('express');
const { createPayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/', createPayment);

module.exports = router;
