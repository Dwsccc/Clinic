// controllers/paymentController.js

const { Payment, Appointment } = require('../models')

const createPayment = async (req, res) => {
  const { appointment_id, amount, method } = req.body

  try {
    const appointment = await Appointment.findByPk(appointment_id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ message: 'Appointment is not confirmed. Cannot pay.' })
    }

    const payment = await Payment.create({
      appointment_id,
      amount,
      method,
      status: 'success',
      payment_time: new Date(),
    })

    appointment.payment_status = 'paid'
    await appointment.save()

    res.status(201).json({
      message: 'Payment successful',
      appointment_id: appointment.id,
      status: appointment.status,
      payment_status: appointment.payment_status,
      payment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createPayment }
