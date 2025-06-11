import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { createTheme, ThemeProvider } from "@mui/material";

const darktheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Appointment = () => {
  const { user, bookAppointment, isLogin } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [reason, setReason] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  if(!isLogin){
    return <Navigate to="/login" replace/>
  }

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookAppointment(
      doctorId,
      date?.toISOString(),
      time?.format("HH:mm"),
      reason,
      user?._id
    );
    alert("Appointment booked successfully!");
    navigate("/list-appointments", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center text-white pt-20 p-4 overflow-hidden">
      <div className="w-full max-w-7xl h-full rounded-xl shadow-xl overflow-hidden flex justify-between">
        <div className="md:w-1/2 h-[80vh] bg-[url('https://images.pexels.com/photos/3845981/pexels-photo-3845981.jpeg?auto=compress&cs=tinysrgb&w=3840')] bg-cover bg-center rounded-xl" ></div>

        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <ThemeProvider theme={darktheme}>
              <TextField
                label="Doctor ID"
                variant="outlined"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                fullWidth
                required
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  required
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Select Time"
                  value={time}
                  onChange={(newValue) => setTime(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  required
                />
              </LocalizationProvider>

              <TextField
                label="Reason for Appointment"
                variant="outlined"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
                multiline
                rows={3}
                required
              />
            </ThemeProvider>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#21848b] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#1c6b70] transition duration-300"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
