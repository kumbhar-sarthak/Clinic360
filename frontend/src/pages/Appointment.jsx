import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";

const Appointment = () => {
  const { getappointment, bookAppointment } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setreason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookAppointment(doctorId, date, time, reason);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Book Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Doctor ID</label>
            <input
              type="text"
              placeholder="Find Doctor and Enter ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">reason</label>
            <input
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setreason(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
