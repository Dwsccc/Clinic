import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // Ensure correct path

function MyProfile() {
  const { token, updateAvatarUrl, role, user } = useContext(UserContext);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    image: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        let endpoint = 'http://localhost:3000/api/user/me';
        if (role === 'doctor') {
          endpoint = 'http://localhost:3000/api/doctor/me';
        } else if (role === 'admin') {
          endpoint = 'http://localhost:3000/api/admin/me';
        }

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load profile information');
        const data = await res.json();

        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          gender: data.gender || '',
          dob: data.birthdate ? data.birthdate.split('T')[0] : '',
          image: data.avatar_url || 'https://placehold.co/150x150',
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (token && role) {
      fetchProfile();
    }
  }, [token, role]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Show preview image immediately
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, image: imageUrl }));

      // Upload image to server
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/user/upload-avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Image upload failed');
        }

        const data = await res.json();

        const fullUrl = `http://localhost:3000${data.url}`;

        // ✅ Update state and context
        setProfile(prev => ({ ...prev, image: fullUrl }));
        updateAvatarUrl(fullUrl); // <<< This line is very important!
        const updatedUser = { ...user, avatar_url: fullUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Release old blob URL
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        console.error(error);
        alert('Image upload failed');
      }
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage('');
    try {
      let endpoint = 'http://localhost:3000/api/user/me';
      if (role === 'doctor') {
        endpoint = 'http://localhost:3000/api/doctor/me';
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          gender: profile.gender,
          birthdate: profile.dob,
          avatar_url: profile.image,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Update failed');
      }

      setSaveMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (e) {
      setSaveMessage(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  function toggleEdit() {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
      setSaveMessage('');
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>
      <div className="flex border rounded-lg shadow-md overflow-hidden bg-white">
        <div className="w-1/3 bg-gray-100 p-6 text-center">
          <img
            src={profile.image}
            alt="avatar"
            className="w-36 h-36 rounded-full object-cover mx-auto mb-4 border-2 border-gray-300"
          />
          {isEditing && (
            <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-blue-700 transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="w-2/3 p-6">
          <ProfileField
            label="Full Name"
            name="name"
            value={profile.name}
            editable={isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Email"
            name="email"
            value={profile.email}
            editable={false}
          />
          <ProfileField
            label="Phone Number"
            name="phone"
            value={profile.phone}
            editable={isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Address"
            name="address"
            value={profile.address}
            editable={isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Gender"
            name="gender"
            value={profile.gender}
            editable={isEditing}
            onChange={handleChange}
            type="select"
          />
          <ProfileField
            label="Date of Birth"
            name="dob"
            value={profile.dob}
            editable={isEditing}
            onChange={handleChange}
            type="date"
          />
          <button
            onClick={toggleEdit}
            disabled={saving}
            className={`mt-6 px-6 py-3 rounded text-white font-semibold transition ${
              isEditing
                ? saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </button>
          {saveMessage && (
            <p
              className={`mt-4 ${
                saveMessage.startsWith('Error') ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {saveMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, name, value, editable, onChange, type = 'text' }) {
  if (!editable) {
    return (
      <div className="mb-5">
        <label className="block font-semibold mb-1">{label}:</label>
        <p className="text-gray-700">{value}</p>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="mb-5">
        <label className="block font-semibold mb-1">{label}:</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <label className="block font-semibold mb-1">{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default MyProfile;
