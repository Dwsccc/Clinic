import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [user, setUser] = useState(null);
  const currencySymbol = 'VietNamDong';

  useEffect(() => {
    // Lấy danh sách bác sĩ
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bác sĩ:', error);
      }
    };

    fetchDoctors();

    // Lấy user từ localStorage (nếu có)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm hỗ trợ lấy header Authorization
  const getAuthHeader = () => {
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  const value = {
    doctors,
    setDoctors,
    user,
    setUser,
    currencySymbol,
    getAuthHeader // Nếu cần dùng ở component khác
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
