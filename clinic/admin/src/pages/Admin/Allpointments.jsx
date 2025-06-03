import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";

const AppointmentPage = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/appointments/all`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error("Failed to fetch appointment list");
      }
    } catch (error) {
      toast.error("Server error while fetching appointments: " + error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointments/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        toast.success("Status updated successfully");
        if (data.updatedAppointment) {
          setAppointments((prev) =>
            prev.map((ap) => (ap.id === id ? data.updatedAppointment : ap))
          );
        } else {
          setAppointments((prev) =>
            prev.map((ap) =>
              ap.id === id ? { ...ap, status: String(newStatus) } : ap
            )
          );
        }
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error updating status. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      if (data.success) {
        toast.success("Appointment deleted successfully");
        setAppointments((prev) => prev.filter((ap) => ap.id !== id));
      } else {
        toast.error(data.message || "Failed to delete appointment");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server error while deleting appointment. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const now = new Date();
  const currentAppointments = appointments.filter(
    (ap) => new Date(ap.start_time) >= now
  );
  const pastAppointments = appointments.filter(
    (ap) => new Date(ap.start_time) < now
  );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const AppointmentCard = ({ ap, isPast, onDelete, onStatusChange }) => (
    <div className="bg-white border rounded-lg p-5 mb-6 shadow hover:shadow-md transition-shadow">
      <p><strong>Patient:</strong> {ap.user?.name || "N/A"}</p>
      <p><strong>Doctor:</strong> {ap.doctor?.name || "N/A"}</p>
      <p><strong>Time:</strong> {new Date(ap.start_time).toLocaleString()}</p>
      <p><strong>Note:</strong> {ap.note || "No note"}</p>

      <p className="mt-3 flex items-center gap-2">
        <strong>Status:</strong>
        {isPast ? (
          <span className="ml-2 text-gray-600 italic">{ap.status}</span>
        ) : (
          <select
            value={ap.status}
            onChange={(e) => onStatusChange(ap.id, e.target.value)}
            className="ml-2 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={ap.status === "confirmed" || ap.status === "cancelled"} // khóa chọn nếu confirmed hoặc cancelled
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">cancelled</option>
          </select>
        )}
      </p>

      <p className="mt-2">
        <strong>Payment:</strong>{" "}
        <span
          className={`font-semibold ${
            ap.payment_status === "paid" ? "text-green-600" : "text-red-600"
          }`}
        >
          {ap.payment_status}
        </span>
      </p>

      {!isPast && (
        <button
          onClick={() => onDelete(ap.id)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition-colors"
        >
          Delete Appointment
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Appointment List</h1>

      {/* UPCOMING */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Upcoming Appointments</h2>
      {currentAppointments.length === 0 ? (
        <p className="text-gray-500">No upcoming appointments.</p>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {currentAppointments.map((ap) => (
            <AppointmentCard
              key={ap.id}
              ap={ap}
              isPast={false}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Masonry>
      )}

      {/* PAST */}
      <h2 className="text-xl font-semibold mb-4 mt-10">Past Appointments</h2>
      {pastAppointments.length === 0 ? (
        <p className="text-gray-500">No past appointments yet.</p>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {pastAppointments.map((ap) => (
            <AppointmentCard
              key={ap.id}
              ap={ap}
              isPast={true}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default AppointmentPage;
