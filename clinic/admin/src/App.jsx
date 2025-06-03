import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Thêm import style
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import Allpointments from "./pages/Admin/Allpointments";
import Dashboard from "./pages/Admin/Dashboard";
import Sidebar from "./components/Sidebar";
import UserList from "./pages/Admin/UserList";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import { DoctorContext } from "./context/DoctorContext";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken) {
    // Chưa đăng nhập, hiển thị login theo route
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="/admin/login" element={<Login role="Admin" />} />
          <Route path="/doctor/login" element={<Login role="Doctor" />} />
          {/* Nếu người dùng vào đường dẫn khác, redirect về admin login hoặc 404 */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </>
    );
  }

  if (aToken) {
    // Admin đã đăng nhập
    return (
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointment" element={<Allpointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            <Route path="/user-list" element={<UserList />} />
            {/* Admin logout hoặc không hợp lệ sẽ redirect */}
            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  if (dToken) {
    // Bác sĩ đã đăng nhập
    return (
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/doctor-dashboard" replace />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  return null; // hoặc 1 loading fallback
};

export default App;
