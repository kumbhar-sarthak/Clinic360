import { query, Router } from "express";
import Doctor from "../models/DoctorModel.js";
import ThrowError from "../utility/ErrorHandler.js";
import authmiddleware from "../middleware/auth.middleware.js";
import Appointment from "../models/AppointmentModel.js";

const DoctorRouter = Router();

DoctorRouter.get("/me", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) throw new ThrowError(400, "User ID is required");

    const doctor = await Doctor.findOne({ userId });

    if (!doctor) throw new ThrowError(401, "Doctor not found");

    res.status(200).json({ doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error while finding Doctor", error });
  }
});


DoctorRouter.get(
  "/doctor/me/appointments",
  authmiddleware,
  async (req, res) => {
    const doctor = await Appointment.find({ doctorId: req.user?.id });

    if (!doctor) throw new ThrowError(404, "Doctor Not Found");

    res.status(200).json({
      appointments: doctor,
    });
  }
);

DoctorRouter.post("/search", authmiddleware, async (req, res) => {
  const { speciality, location, experience, availability } = req.body;


  if (
    [speciality, location, experience, availability].some(
      (i) => i === undefined || i === null
    )
  )
    throw new ThrowError(404, "fileds are missing");

  const filters = [];

  if (speciality) filters.unshift({ speciality });
  if (location) filters.push({ location });
  if (experience) filters.push({ experience });
  if (availability) filters.push({ availability });

  const query = filters.length > 0 ? { $or: filters } : {}

  const doctors = await Doctor.find(query).sort({ speciality: -1});

  if (!doctors) throw new ThrowError(404, "Doctor Not Found");

  res.status(200).json({
    doctors,
  });
});

DoctorRouter.post("/available", authmiddleware, async (req, res) => {
  const { doctorId, availability } = req.body;
  try {
    await Doctor.findByIdAndUpdate(doctorId, { availability });
    res.json({ msg: "Availability updated" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

DoctorRouter.put("/:doctorId",authmiddleware,async (req,res)=>{
  try {
    const { doctorId } = req.params;
    const { location, availability } = req.body;


    const updateFileds = {}

    if(location !== undefined) updateFileds.location = location;
    if(availability !== undefined) updateFileds.availability = availability;
    
  
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $set: updateFileds },
      { new: true }
    );

    if(!updatedDoctor)
      throw new ThrowError(404,"Doctor not updated");
  
    res.status(200).json({ success: true, doctor: updatedDoctor });
  } catch (error) {
    res.status(500).json({ error: "Failed to update doctor info" });
  }
})

export default DoctorRouter;
