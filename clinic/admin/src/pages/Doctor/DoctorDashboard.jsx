import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from 'react-toastify'

const DoctorDashboard = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    dashboardStats,
    getDashboardStats,
  } = useContext(DoctorContext)

  // Các thống kê tình trạng lịch hẹn hiện tại
  const [confirmedCount, setConfirmedCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [cancelledCount, setCancelledCount] = useState(0)

  useEffect(() => {
    if (dToken) {
      getAppointments()
      getDashboardStats()
    } else {
      toast.error('Bạn chưa đăng nhập hoặc token không hợp lệ!')
      // Có thể redirect về login nếu muốn
    }
  }, [dToken])

  // Cập nhật số lượng lịch hẹn theo trạng thái khi appointments thay đổi
  useEffect(() => {
    if (appointments.length > 0) {
      setConfirmedCount(appointments.filter(a => a.status === 'confirmed').length)
      setPendingCount(appointments.filter(a => a.status === 'pending').length)
      setCancelledCount(appointments.filter(a => a.status === 'cancelled').length)
    } else {
      setConfirmedCount(0)
      setPendingCount(0)
      setCancelledCount(0)
    }
  }, [appointments])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <section className="mb-6 p-4 border rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Thống kê tổng quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <div className="p-4 bg-blue-100 rounded-md text-center">
            <p className="text-lg font-semibold">{dashboardStats.completedAppointments || 0}</p>
            <p>Số cuộc hẹn đã làm</p>
          </div>
          <div className="p-4 bg-green-100 rounded-md text-center">
            <p className="text-lg font-semibold">{dashboardStats.totalRevenue ? dashboardStats.totalRevenue.toLocaleString() : 0} VND</p>
            <p>Tổng doanh thu</p>
          </div>
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-md shadow max-w-md">
        <h2 className="text-xl font-semibold mb-4">Lịch hẹn hiện tại theo trạng thái</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-100 rounded-md text-center">
            <p className="text-lg font-semibold">{confirmedCount}</p>
            <p>Đã xác nhận</p>
          </div>
          <div className="p-4 bg-orange-100 rounded-md text-center">
            <p className="text-lg font-semibold">{pendingCount}</p>
            <p>Đang chờ</p>
          </div>
          <div className="p-4 bg-red-100 rounded-md text-center">
            <p className="text-lg font-semibold">{cancelledCount}</p>
            <p>Đã hủy</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DoctorDashboard
