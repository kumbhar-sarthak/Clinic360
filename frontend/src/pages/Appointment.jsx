import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const Appointment = () => {
  const { user, bookAppointment } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setreason] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();


  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookAppointment(doctorId, date, time, reason, user?._id);
    alert("Appointment booked successfully!");
    navigate("/list-appointments", { replace: true });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="p-4">
        <h2 className="text-2xl text-[#088395] text-center font-semibold mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <div>
            <TextField
              id="standard-basic"
              onChange={(e) => setDoctorId(e.target.value)}
              value={doctorId}
              label="Doctor ID"
              variant="outlined"
              className="w-full"
              required
            />
          </div>
          <div className="mt-8">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Select Date"
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  required
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <div className="mt-8">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem >
                {width < 700 ? <TimePicker label="Time" name="startTime" onChange={(e) => setTime(e.target.value)}/> : <StaticTimePicker orientation="landscape" className="w-[500px]"/>}
                
                
              </DemoItem>
            </LocalizationProvider>
          </div>
          <div className="mt-8">
            <TextField
              id="standard-basic"
              label="Reason"
              variant="outlined"
              value={reason}
              onChange={(e) => setreason(e.target.value)}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-8 bg-[#071952] text-white p-2 rounded-md cursor-pointer"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
