import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});

  const loginDoctor = (token) => {
    setDToken(token);
    localStorage.setItem("dToken", token);
  };

  const logoutDoctor = () => {
    setDToken("");
    localStorage.removeItem("dToken");
    setAppointments([]);
    setDoctorProfile(null);
    setDashboardStats({});
  };

  // Lấy profile bác sĩ từ /api/doctor/me
  const getDoctorProfile = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/me`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      setDoctorProfile(data); // API trả về trực tiếp doctor object
    } catch (error) {
      toast.error("Lỗi khi tải profile bác sĩ: " + error.response?.data?.message || error.message);
    }
  };

  // Lấy danh sách lịch hẹn
  const getAppointments = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Không thể tải thông tin lịch hẹn");
      }
    } catch (error) {
      toast.error("Lỗi khi tải lịch hẹn: " + error.response?.data?.error || error.message);
    }
  };

  // Lấy thống kê dashboard
  const getDashboardStats = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setDashboardStats(data.stats);
      } else {
        toast.error("Không thể tải thống kê");
      }
    } catch (error) {
      toast.error("Lỗi khi tải dashboard: " + error.response?.data?.error || error.message);
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        backendUrl,
        dToken,
        setDToken,
        loginDoctor,
        logoutDoctor,
        appointments,
        setAppointments,
        doctorProfile,
        getDoctorProfile,
        getAppointments,
        dashboardStats,
        getDashboardStats,
      }}
    >
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
