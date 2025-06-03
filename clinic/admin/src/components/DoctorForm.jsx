import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const DoctorForm = ({ doctor, onClose, onUpdate }) => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fees, setFees] = useState("");
  const [avatar, setAvatar] = useState(null); // ảnh mới chọn upload
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); // ảnh hiện tại (url)
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [address, setAddress] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("1 Year");

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || "");
      setEmail(doctor.email || "");
      setFees(doctor.fees || "");
      setAbout(doctor.about || "");
      setSpeciality(doctor.speciality || "General Physician");
      setAddress(doctor.address || "");
      setDegree(doctor.degree || "");
      setExperience(doctor.experience || "1 Year");
      setCurrentAvatarUrl(doctor.avatar || null);
    }
  }, [doctor]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!doctor) {
      return toast.error("Không có bác sĩ để cập nhật");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("fees", fees);
    formData.append("about", about);
    formData.append("speciality", speciality);
    formData.append("address", address);
    formData.append("degree", degree);
    formData.append("experience", experience);

    if (avatar) {
      formData.append("image", avatar);
    }

    try {
      await axios.put(
        `${backendUrl}/api/admins/doctors/${doctor.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Cập nhật bác sĩ thành công");
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi gửi form");
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md max-w-3xl mx-auto my-4">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa bác sĩ</h2>
      <form onSubmit={onSubmitHandler} encType="multipart/form-data">
        {/* Ảnh avatar */}
        <div className="mb-6 flex items-center gap-4">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : currentAvatarUrl ||
                    "https://via.placeholder.com/80x80?text=No+Image"
              }
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="hidden"
          />
          <span className="text-gray-600">Chọn ảnh mới (nếu muốn thay đổi)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tên"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Phí khám"
            className="input input-bordered w-full"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            required
          />

          <select
            className="input input-bordered w-full"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option value="General Physician">General Physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>

          <input
            type="text"
            placeholder="Địa chỉ"
            className="input input-bordered w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="text"
            placeholder="Bằng cấp"
            className="input input-bordered w-full"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />

          <select
            className="input input-bordered w-full"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={`${i + 1} Year${i > 0 ? "s" : ""}`}>
                {i + 1} Year{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Giới thiệu"
          className="textarea textarea-bordered w-full mt-4"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
