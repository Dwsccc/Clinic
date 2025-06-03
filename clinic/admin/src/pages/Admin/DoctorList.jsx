import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import DoctorForm from "../../components/DoctorForm";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, backendUrl } = useContext(AdminContext);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const toggleDoctorActive = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/admins/doctors/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái" + err);
    }
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bác sĩ này?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/admins/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đã xoá bác sĩ");
        getAllDoctors();
      } else {
        toast.error(data.message || "Không thể xoá bác sĩ");
      }
    } catch (err) {
      toast.error("Lỗi khi xoá bác sĩ" + err);
    }
  };

  return (
    <div className="m-5 flex-1 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item) => {
          return (
            <div
              className="group border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer"
              key={item.id}
            >
              <img
  className="w-30 h-30 object-cover rounded-md shadow-md"
  src={`${backendUrl}${item.avatar_url}?t=${new Date().getTime()}`}
                alt=""
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                <p className="text-zinc-600 text-sm">{item.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={item.is_active ?? false}
                    onChange={() => toggleDoctorActive(item.id)}
                  />
                  <p>Available</p>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => setEditingDoctor(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => deleteDoctor(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form chỉnh sửa hiển thị dạng modal nổi */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DoctorForm
              doctor={editingDoctor}
              onClose={() => setEditingDoctor(null)}
              onUpdate={() => {
                getAllDoctors();
                setEditingDoctor(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
