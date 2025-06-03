import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
  const [doctors, setDoctors] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admins/doctors', {
        headers: {
          'Authorization': `Bearer ${aToken}`,
        }
      });

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Hàm logout: xóa token ở localStorage và set lại state aToken
  const logout = () => {
    localStorage.removeItem('aToken'); // xóa token khỏi localStorage
    setAToken('');                     // set lại state aToken rỗng
    setDoctors([]);                   // nếu muốn, reset danh sách bác sĩ khi logout
    toast.success("Đã đăng xuất thành công");
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    getAllDoctors,
    doctors,
    logout,  // thêm hàm logout vào context để gọi bên ngoài
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
