import React, { useContext, useState } from "react";
import { assets } from "../../assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [address, setAddress] = useState('');
  const [degree, setDegree] = useState('');
  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Image not selected');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', fees);
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', address);

      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(`${backendUrl}/api/admins/doctors`, formData, {
        headers: {
          'Authorization': `Bearer ${aToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message);
        // reset form
        setDocImg(null);
        setName('');
        setPassword('');
        setEmail('');
        setAddress('');
        setDegree('');
        setAbout('');
        setFees('');
        setExperience('1 Year');
        setSpeciality('General Physician');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('AddDoctor error:', error);
      toast.error(error.response?.data?.message || 'Error adding doctor');
    }
  };

  return (
    <form className="m-5 flex-1" onSubmit={onSubmitHandler}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Upload ảnh */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Cột trái */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>

              
              <select
                className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                    {i + 1} Year{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Cột phải */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2"
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
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="mt-4">
          <p className="mb-2">About Doctor</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>

        <button className="bg-primary px-10 py-2 mt-4 text-white rounded-full" type="submit">
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
