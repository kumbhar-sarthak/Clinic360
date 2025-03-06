import { Router } from "express";
import ThrowError from "../utility/ErrorHandler.js";
import mongoose from "mongoose";
import Doctor from "../models/DoctorModel.js";
import Appointment from "../models/AppointmentModel.js";
import authmiddleware from "../middleware/auth.middleware.js";

const AppRouter = Router();


AppRouter.post("/book", authmiddleware, async (req, res) => {
  const { doctorid, date, time, reason } = req.body;

  if ([doctorid, date, time, reason].some((i) => i === undefined || i === null)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction(); 

  try {
    const doctor = await Doctor.findOne({ userId: doctorid });

    if (!doctor) {
      throw new ThrowError(404, "Doctor not found");
    }

    const query = { doctorId: doctorid, date, time, reason, status: "Confirmed" };

    const exist = await Appointment.findOne(query); 

    if (exist) {
      throw new ThrowError(409, "The appointment is already booked");
    }

    const appointment = new Appointment({
      doctorId: doctorid,
      patientId: req.user?._id,
      date,
      time,
      status: "confirmed",
      reason,
    });

    await appointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      appointment,
      message: "Appointment is scheduled",
    });
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession();
    console.error("Error booking appointment:", error);

    return res.status(500).json({
      message: "Appointment not booked",
      error: error.message,
    });
  }
});


AppRouter.patch("/cancel/:id", authmiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Invalid appointment ID" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
});



AppRouter.get("/doctor/:doctorId",async (req,res)=>{
  const doctorId = req.params;

  const doctor = await Doctor.findById({userId: doctorId});

  if(!doctor)
    throw new ThrowError(404,"Invalid doctor ID")

  const appointment = await Appointment.find({userId: doctorId}).populate("doctorId","name eamil");

  res
  .status(200)
  .json({
    appointment
  })
})

AppRouter.post("/all", async (req, res) => {
  try {

    if (!req.body?._id) {
      return res.status(400).json({ error: "User ID is required" });
    }

   
    const appointments = await Appointment.find({
      $or: [{ patientId: req.body._id }, { doctorId: req.body._id }],
    })
      .populate("doctorId", "name email") 
      .populate("patientId", "name email");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: "No appointments found" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Server error while fetching appointments" });
  }
});


export default AppRouter