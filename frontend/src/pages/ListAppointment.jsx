import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ListAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  

  useEffect(() => {
    if (!user?._id) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/appointment/all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: user._id }),
          credentials: "include",
        });

        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user?._id]);

  const handleCancel = async (i) => {
    console.log(i);
    try {
      const response = await fetch(`${API_URL}/appointment/cancel/${i}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt._id === i ? { ...appt, status: "cancelled" } : appt
          )
        );
        window.location.reload();
      } else {
        console.error("Failed to cancel appointment:", data.message);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );
  
  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        My Appointments
      </h2>
  
      {confirmedAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {confirmedAppointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-5 relative transition-all hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Doctor</h3>
              <p className="text-gray-800">
                <strong>Name:</strong> {appointment.doctorId?.name || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {appointment.doctorId?.email || "N/A"}
              </p>
  
              <h3 className="text-lg font-semibold text-green-600 mt-3">
                Patient
              </h3>
              <p className="text-gray-800">
                <strong>Name:</strong> {appointment.patientId?.name || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {appointment.patientId?.email || "N/A"}
              </p>
  
              <h3 className="text-lg font-semibold text-purple-600 mt-3">
                Details
              </h3>
              <p className="text-gray-700">
                <strong>Date & Time:</strong> {appointment.date} -{" "}
                {appointment.time || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Reason:</strong> {appointment.reason || "N/A"}
              </p>
  
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span className="font-bold text-green-600">
                  {appointment.status}
                </span>
              </p>
  
              {user?.role === "patient" && (
                <div className="mt-4">
                  <button
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => handleCancel(appointment._id)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No confirmed appointments found</div>
      )}
    </div>
  );
}  

export default ListAppointments;
