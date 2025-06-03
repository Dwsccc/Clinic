import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(AdminContext); // ✅ Lấy đúng context

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("aToken");

      const res = await axios.get(`${backendUrl}/api/admins/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API response:', res.data);
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        setError('Lỗi khi lấy dữ liệu: ' + (res.data.message || 'Không xác định'));
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Lỗi khi lấy dữ liệu: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);


  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!stats) return null;

  // Parse lại totalRevenue nếu backend trả sai kiểu
  let revenue = stats.totalRevenue;
  if (typeof revenue === 'string') {
    revenue = parseFloat(revenue.replace(/[^\d.]/g, '')) || 0;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Tổng người dùng" value={stats.totalUsers} />
      <StatCard title="Tổng bác sĩ" value={stats.totalDoctors} />
      <StatCard title="Tổng cuộc hẹn" value={stats.totalAppointments} />
      <StatCard title="Doanh thu (VND)" value={revenue.toLocaleString()} />
      <StatCard title="Đã xác nhận" value={stats.confirmedAppointments} />
      <StatCard title="Đã hủy" value={stats.canceledAppointments} />
      <StatCard title="Đang chờ" value={stats.pendingAppointments} />
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-3xl font-semibold mt-2">{value}</p>
  </div>
);

export default Dashboard;
