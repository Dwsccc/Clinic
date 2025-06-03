import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const UserList = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [users, setUsers] = useState([]);

  // Fetch all users except password_hash
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admins/users`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users list");
      }
    } catch (error) {
      toast.error("Server error when fetching users: " + error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user by id
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${backendUrl}/api/admins/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">User List</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">ID</th>
              <th className="p-3 border-b border-gray-300 text-left">Avatar & Name</th>
              <th className="p-3 border-b border-gray-300 text-left">Email</th>
              <th className="p-3 border-b border-gray-300 text-left">Phone</th>
              <th className="p-3 border-b border-gray-300 text-left">Gender</th>
              <th className="p-3 border-b border-gray-300 text-left">Birthdate</th>
              <th className="p-3 border-b border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-300">{user.id}</td>

                <td className="p-3 border-b border-gray-300 flex items-center space-x-3">
                  <img
                    src={user.avatar_url || "/default-avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <span>{user.name}</span>
                </td>

                <td className="p-3 border-b border-gray-300">{user.email}</td>
                <td className="p-3 border-b border-gray-300">{user.phone || "-"}</td>
                <td className="p-3 border-b border-gray-300 capitalize">{user.gender || "-"}</td>
                <td className="p-3 border-b border-gray-300">
                  {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : "-"}
                </td>

                <td className="p-3 border-b border-gray-300">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
