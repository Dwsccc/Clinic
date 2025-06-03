import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    experience: "1 Year",
    speciality: "General Physician",
    address: "",
    fees: "",
    about: "",
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("dToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDoctor(data.doctor);
        setFormData({
          name: data.doctor.name || "",
          email: data.doctor.email || "",
          degree: data.doctor.degree || "",
          experience: data.doctor.experience || "1 Year",
          speciality: data.doctor.speciality || "General Physician",
          address: data.doctor.address || "",
          fees: data.doctor.fees || "",
          about: data.doctor.about || "",
        });
      } else {
        toast.error("Unable to load profile data.");
      }
    } catch (err) {
      toast.error("Error fetching doctor profile." + err);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      if (image) updateData.append("image", image);
      Object.keys(formData).forEach((key) => updateData.append(key, formData[key]));

      const { data } = await axios.put(`${backendUrl}/api/doctors/me`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Profile updated successfully!");
        fetchDoctorProfile();
        setImage(null);
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile.");
    }
  };

  if (!doctor) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  const avatarSrc = image
    ? URL.createObjectURL(image)
    : doctor.avatar_url
    ? doctor.avatar_url.startsWith("http")
      ? doctor.avatar_url
      : `${backendUrl}${doctor.avatar_url}`
    : "https://via.placeholder.com/80";

  return (
    <div className="flex place-items-start justify-center bg-gray-100 p-0 min-h-screen">
      <div
        className="w-[95%] max-w-6xl bg-white shadow-md rounded-xl p-8 flex flex-col"
        style={{ height: "700px", maxHeight: "90vh" }}
      >
        <form
          onSubmit={handleUpdate}
          className="space-y-6 overflow-y-auto p-0"
          style={{ flexGrow: 1, maxHeight: "calc(100% - 56px)" }}
        >
          <div className="flex items-center gap-6">
            <label htmlFor="avatar" className="cursor-pointer">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-20 h-20 object-cover rounded-full border"
              />
              <input
                type="file"
                id="avatar"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <span className="text-sm text-gray-500">Click the image to change avatar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Degree</label>
              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year${i > 0 ? "s" : ""}`}>
                    {i + 1} year{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Speciality</label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option>General Physician</option>
                <option>Dermatology</option>
                <option>Obstetrics and Gynecology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Consultation Fee</label>
              <input
                name="fees"
                type="number"
                value={formData.fees}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">About</label>
              <textarea
                name="about"
                rows="4"
                value={formData.about}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
