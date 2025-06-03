import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { assets } from '../assets_admin/assets';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-white border-r
                w-[70vw] sm:w-56 md:w-64 flex-shrink-0
                flex flex-col shadow-md ">
      {(aToken || dToken) && (
        <ul className="text-[#515151] mt-5 flex flex-col gap-2">

          {/* === ADMIN SIDEBAR === */}
          {aToken && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.home_icon} alt="Home" className="w-6 h-6" />
                <p className="text-base">Dashboard</p>
              </NavLink>

              <NavLink
                to="/all-appointment"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6" />
                <p className="text-base">Appointments</p>
              </NavLink>

              <NavLink
                to="/add-doctor"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6" />
                <p className="text-base">Add Doctor</p>
              </NavLink>

              <NavLink
                to="/doctor-list"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.people_icon} alt="Doctor List" className="w-6 h-6" />
                <p className="text-base">Doctor List</p>
              </NavLink>

              <NavLink
                to="/user-list"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.patients_icon} alt="User List" className="w-6 h-6" />
                <p className="text-base">User List</p>
              </NavLink>
            </>
          )}

          {/* === DOCTOR SIDEBAR === */}
          {dToken && (
            <>
              <NavLink
                to="/doctor-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6" />
                <p className="text-base">Dashboard</p>
              </NavLink>

              <NavLink
                to="/doctor-appointments"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6" />
                <p className="text-base">My Appointments</p>
              </NavLink>

              <NavLink
                to="/doctor-profile"
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-6 cursor-pointer rounded-r-md
                   transition-colors duration-200
                   ${
                     isActive
                       ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold"
                       : "hover:bg-gray-100"
                   }`
                }
              >
                <img src={assets.doctor_icon} alt="Profile" className="w-6 h-6" />
                <p className="text-base">My Profile</p>
              </NavLink>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
