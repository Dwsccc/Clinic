import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const now = new Date();

  // Tính số cuộc hẹn đã làm (đã được xác nhận và thời gian bắt đầu đã qua)
  const doneAppointmentsCount = appointments.filter(
    (appt) =>
      appt.status === "confirmed" && new Date(appt.start_time) < now
  ).length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Appointments</h2>

      <p className="text-center mb-4 text-gray-600">
        Số cuộc hẹn đã làm: <strong>{doneAppointmentsCount}</strong>
      </p>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments found.</p>
      ) : (
        <div className="space-y-5">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm p-5 hover:shadow-md transition"
            >
              <p><strong>Patient:</strong> {appt.user?.name || 'Unknown'}</p>
              <p><strong>Time:</strong> {new Date(appt.start_time).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    appt.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : appt.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {appt.status}
                </span>
              </p>
              <p><strong>Note:</strong> {appt.note || 'No note provided'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
