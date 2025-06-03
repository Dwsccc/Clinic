// UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Tạo context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // thông tin user
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedToken !== 'undefined' && savedToken !== 'null' && savedRole) {
        setToken(savedToken);
        setRole(savedRole);
      }

      if (savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Lỗi khi load user từ localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, []);

  // Hàm đăng nhập và lưu vào localStorage
  const login = (token, role, userInfo) => {
  setToken(token);
  setRole(role);
  setUser(userInfo);

  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('user', JSON.stringify(userInfo));
};


  // Hàm đăng xuất
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  // Hàm cập nhật avatar url và lưu vào cả state + localStorage
  const updateAvatarUrl = (newUrl) => {
    setUser(prev => {
      if (!prev) return prev; // nếu chưa có user thì bỏ qua
      const updatedUser = { ...prev, avatar_url: newUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, token, role, login, logout, updateAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};
