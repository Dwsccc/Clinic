import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

const MyAppointments = () => {
  const { token } = useContext(UserContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/appointments/my', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        })

        if (!res.ok) throw new Error('Failed to fetch appointments')

        const data = await res.json()
        setAppointments(data.appointments || []) // đảm bảo luôn là mảng
      } catch (error) {
        console.error('Lỗi khi tải lịch hẹn:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [token])

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return

    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Không thể hủy lịch hẹn')

      setAppointments((prev) =>
        prev.map((appt) => appt.id === id ? { ...appt, status: 'cancelled' } : appt)
      )
      alert('Hủy lịch hẹn thành công')
    } catch (error) {
      console.error(error)
      alert('Lỗi khi hủy lịch hẹn')
    }
  }

  const handleFakePayment = async (id, amount) => {
    if (!window.confirm(`Bạn muốn thanh toán ${amount}đ cho lịch hẹn này?`)) return

    try {
      const res = await fetch('http://localhost:3000/api/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: id,
          amount,
          method: 'cash',
        }),
      })

      if (!res.ok) throw new Error('Thanh toán thất bại')

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, payment_status: 'paid' } : appt
        )
      )

      alert('Thanh toán thành công!')
    } catch (error) {
      console.error(error)
      alert('Lỗi khi thanh toán')
    }
  }

  if (loading) return <p>Đang tải dữ liệu...</p>
  if (appointments.length === 0) return <p>Không có lịch hẹn nào.</p>

  const currentAppointments = appointments.filter((appt) => new Date(appt.start_time) > new Date())
  const pastAppointments = appointments.filter((appt) => new Date(appt.start_time) <= new Date())

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">Lịch hẹn của tôi</p>

      {/* Lịch hẹn hiện tại */}
      <div className="mt-8">
        <p className="font-semibold text-lg">Lịch hẹn hiện tại</p>
        {currentAppointments.length === 0 ? (
          <p>Không có lịch hẹn hiện tại.</p>
        ) : (
          currentAppointments.map((appt) => {
            const { doctor, start_time, id, status, payment_status } = appt

            if (!doctor) {
              return (
                <div key={id} className="py-2 text-red-600 border-b">
                  ⚠ Appointment #{id} is missing doctor information.
                </div>
              )
            }

            const datetime = new Date(start_time)
            const formattedDate = datetime.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            const formattedTime = datetime.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })

            const statusColor =
              status === 'confirmed'
                ? 'text-green-600'
                : status === 'pending'
                ? 'text-yellow-600'
                : 'text-red-600'

            const statusText =
              status === 'confirmed'
                ? 'Đã xác nhận'
                : status === 'pending'
                ? 'Đang chờ xác nhận'
                : 'Đã hủy'

            const paymentText =
              payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'

            return (
              <div key={id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
                <div>
                  <img
                    className="w-32 h-32 object-cover rounded-lg bg-indigo-50"
                    src={`http://localhost:3000${doctor.avatar_url || '/default-avatar.png'}`}
                    alt={doctor.name || 'Doctor'}
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">{doctor.name}</p>
                  <p>{doctor.speciality}</p>
                  <p className="mt-1 text-zinc-700 font-medium">Địa chỉ:</p>
                  <p className="text-xs">{doctor.address || 'Không có thông tin'}</p>

                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Thời gian: </span>
                    {formattedDate} | {formattedTime}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Trạng thái: </span>
                    <span className={`${statusColor} font-semibold`}>{statusText}</span>
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Phí khám: </span>
                    <span>{doctor.fees?.toLocaleString()}đ</span>
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Thanh toán: </span>
                    <span className={payment_status === 'paid' ? 'text-green-600' : 'text-yellow-700'}>
                      {paymentText}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2 justify-end">
                  {status === 'confirmed' && appt.payment_status !== 'paid' && (
                    <button
                      onClick={() => handleFakePayment(id, doctor.fees)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Thanh toán
                    </button>
                  )}

                  {status !== 'cancelled' && appt.payment_status !== 'paid' && (
                    <button
                      onClick={() => handleCancel(id)}
                      className="text-sm text-red-600 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Hủy lịch hẹn
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Lịch hẹn đã qua */}
      <div className="mt-8">
        <p className="font-semibold text-lg">Lịch hẹn đã qua</p>
        {pastAppointments.length === 0 ? (
          <p>Không có lịch hẹn đã qua.</p>
        ) : (
          pastAppointments.map((appt) => {
            const { doctor, start_time, id, status, payment_status } = appt

            if (!doctor) {
              return (
                <div key={id} className="py-2 text-red-600 border-b">
                  ⚠ Appointment #{id} is missing doctor information.
                </div>
              )
            }

            const datetime = new Date(start_time)
            const formattedDate = datetime.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            const formattedTime = datetime.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })

            const statusColor =
              status === 'confirmed'
                ? 'text-green-600'
                : status === 'pending'
                ? 'text-yellow-600'
                : 'text-red-600'

            const statusText =
              status === 'confirmed'
                ? 'Đã xác nhận'
                : status === 'pending'
                ? 'Đang chờ xác nhận'
                : 'Đã hủy'

            const paymentText =
              payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'

            return (
              <div key={id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
                <div>
                  <img
                    className="w-32 h-32 object-cover rounded-lg bg-indigo-50"
                    src={`http://localhost:3000${doctor.avatar_url || '/default-avatar.png'}`}
                    alt={doctor.name || 'Doctor'}
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">{doctor.name}</p>
                  <p>{doctor.speciality}</p>
                  <p className="mt-1 text-zinc-700 font-medium">Địa chỉ:</p>
                  <p className="text-xs">{doctor.address || 'Không có thông tin'}</p>

                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Thời gian: </span>
                    {formattedDate} | {formattedTime}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Trạng thái: </span>
                    <span className={`${statusColor} font-semibold`}>{statusText}</span>
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Phí khám: </span>
                    <span>{doctor.fees?.toLocaleString()}đ</span>
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm font-medium text-neutral-700">Thanh toán: </span>
                    <span className={payment_status === 'paid' ? 'text-green-600' : 'text-yellow-700'}>
                      {paymentText}
                    </span>
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyAppointments
