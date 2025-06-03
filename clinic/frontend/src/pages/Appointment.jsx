import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { UserContext } from "../contexts/UserContext";

const Appointment = () => {
  const { id } = useParams();
  const { user, token } = useContext(UserContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [selectedDatetime, setSelectedDatetime] = useState(null);

  // State mới: lưu danh sách thời gian confirmed
  const [confirmedTimes, setConfirmedTimes] = useState([]);

  // Lấy thông tin bác sĩ
  const fetchDocInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/doctors/${id}`);
      if (!res.ok) throw new Error("Doctor not found");
      const data = await res.json();
      setDocInfo(data);
    } catch (err) {
      console.error("Error fetching doctor info:", err);
    }
  };

  // Lấy danh sách confirmed appointment times từ backend
  const fetchConfirmedTimes = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "http://localhost:3000/api/appointments/confirmed-times",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch confirmed times");
      const data = await res.json();
      setConfirmedTimes(data.confirmedTimes || []);
    } catch (err) {
      console.error("Error fetching confirmed times:", err);
    }
  };

  // Tạo slot thời gian trong 7 ngày tới
  const getAvailableSlots = () => {
    let slots = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const day = new Date(now);
      day.setDate(now.getDate() + i);

      const start = new Date(day);
      const end = new Date(day);
      end.setHours(21, 0, 0, 0);

      if (i === 0) {
        const nextHour = now.getHours() + 1;
        start.setHours(
          nextHour < 10 ? 10 : nextHour,
          now.getMinutes() > 30 ? 30 : 0,
          0,
          0
        );
      } else {
        start.setHours(10, 0, 0, 0);
      }

      const dailySlots = [];
      while (start < end) {
        dailySlots.push({
          datetime: new Date(start),
          time: start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        start.setMinutes(start.getMinutes() + 30);
      }

      slots.push(dailySlots);
    }

    setDocSlots(slots);
  };

  // Kiểm tra slot có trùng với confirmed times không
  const isSlotConfirmed = (slotDatetime) => {
    return confirmedTimes.some(({ start_time, end_time }) => {
      const start = new Date(start_time);
      const end = new Date(end_time);
      return slotDatetime >= start && slotDatetime < end;
    });
  };

  useEffect(() => {
    fetchDocInfo();
  }, [id]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    if (token && docInfo) {
      fetchConfirmedTimes();
    }
  }, [token, docInfo]);

  // Xử lý đặt lịch
  const handleBookAppointment = async () => {
    if (!token || !user) {
      alert("Please login before booking.");
      return;
    }

    if (!selectedDatetime) {
      alert("Please select a time slot.");
      return;
    }

    // Kiểm tra slot có bị confirmed rồi không (an toàn thêm lần nữa)
    if (isSlotConfirmed(selectedDatetime)) {
      alert("This time slot is no longer available. Please select another.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          doctor_id: parseInt(id),
          start_time: selectedDatetime.toISOString(),
          status: "pending",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
  throw new Error(errorData.message || "Failed to book appointment");
      }

      const result = await response.json();
      alert("Appointment booked successfully!");
      console.log(result);

      // Sau khi book thành công, load lại danh sách confirmed times để cập nhật UI
      fetchConfirmedTimes();

      // Reset lựa chọn
      setSlotTime("");
      setSelectedDatetime(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    docInfo && (
      <div>
        {/* Thông tin bác sĩ */}
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={`http://localhost:3000${docInfo.avatar_url}`}
            alt=""
          />

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full text-gray-400">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fees:
              <span className="text-gray-600"> {docInfo.fees}</span> Việt Nam Đồng
            </p>
          </div>
        </div>

        {/* Chọn slot */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((day, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-gray-300"
                }`}
              >
                <p>{daysOfWeek[day[0]?.datetime.getDay()]}</p>
                <p>{day[0]?.datetime.getDate()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.map((slot, idx) => {
              const disabled = isSlotConfirmed(slot.datetime);
              return (
                <p
                  key={idx}
                  onClick={() => {
                    if (!disabled) {
                      setSlotTime(slot.time);
                      setSelectedDatetime(slot.datetime);
                    }
                  }}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    disabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : slot.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {slot.time.toLowerCase()}
                </p>
              );
            })}
          </div>

          <button
            onClick={handleBookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>
      </div>
    )
  );
};

export default Appointment;
