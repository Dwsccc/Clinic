import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ role }) => {
  const { loginDoctor } = useContext(DoctorContext);
  const { setAToken, backendUrl } = useContext(AdminContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (role === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/auth/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Đăng nhập Admin thành công!");
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message || "Đăng nhập thất bại");
        }
      } else if (role === "Doctor") {
        const { data } = await axios.post(`${backendUrl}/api/auth/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          loginDoctor(data.token);
          toast.success("Đăng nhập Bác sĩ thành công!");
          navigate("/doctor-dashboard");
        } else {
          toast.error("Đăng nhập thất bại");
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Đăng nhập thất bại");
      } else {
        toast.error("Lỗi kết nối đến server");
      }
    }
  };

  const switchRole = () => {
    if (role === "Admin") {
      navigate("/doctor/login");
    } else {
      navigate("/admin/login");
    }
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{role}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {role === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={switchRole}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={switchRole}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
