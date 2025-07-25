import { Router } from "express";
import ThrowError from "../utility/ErrorHandler.js";
import mongoose from "mongoose";
import Doctor from "../models/DoctorModel.js";
import Appointment from "../models/AppointmentModel.js";
import authmiddleware from "../middleware/auth.middleware.js";
import User from "../models/authModel.js";
import dotenv from "dotenv";
import sendMail from "../utility/Mail.js";

dotenv.config();

const AppRouter = Router();

AppRouter.post("/book", authmiddleware, async (req, res, next) => {
  const { doctorid, date, time, reason, _id } = req.body;

  if (![doctorid, date, time, reason].every(Boolean)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let transactionCommitted = false;

  try {
    const doctor = await Doctor.findOne({ userId: doctorid }).session(session);
    const patient = await User.findById(_id).session(session);

    if (!doctor || !patient) {
      await session.abortTransaction();
      session.endSession();
      return next(new ThrowError(404, "Doctor or patient not found"));
    }

    const existingAppointment = await Appointment.findOne({
      doctorId: doctorid,
      date,
      time,
      reason,
      status: "confirmed",
    }).session(session);

    if (existingAppointment) {
      await session.abortTransaction();
      session.endSession();
      return next(new ThrowError(400, "The appointment is already booked"));
    }

    const appointment = new Appointment({
      doctorId: doctorid,
      patientId: _id,
      date,
      time,
      status: "confirmed",
      reason,
    });

    await appointment.save({ session });

    await session.commitTransaction();
    transactionCommitted = true;
    session.endSession();

    const subject = "Appointment Booked - Get well Soon 💐💐";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #2c3e50; text-align: center;">📅 Appointment Confirmation</h2>
  
  <p style="font-size: 16px;">Hello,</p>
  <p style="font-size: 16px;">
    Your appointment has been successfully <strong style="color: green;">confirmed</strong>. Below are the details:
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
    <tr>
      <td style="padding: 8px; font-weight: bold;">🕒 Time:</td>
      <td style="padding: 8px;">${time}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">📅 Date:</td>
      <td style="padding: 8px;">${date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">📌 Status:</td>
      <td style="padding: 8px;"><span style="color: green; font-weight: bold;">Confirmed</span></td>
    </tr>
  </table>

  <p style="margin-top: 20px; font-size: 15px;">Please arrive 10 minutes before your scheduled time. If you have any questions, feel free to reply to this email.</p>

  <p style="font-size: 14px; color: #555;">Thank you,<br>The Clinic360 Team</p>
</div>

    `;

    const mailSent = await sendMail(patient.email, subject, html);
    if (!mailSent) {
      return next(new ThrowError(500, "Failed to send confirmation email"));
    }

    return res.status(201).json({
      appointment,
      message: "Appointment is scheduled",
    });
  } catch (error) {
    if (!transactionCommitted && session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Error booking appointment:", error);
    return next(new ThrowError(500, "Appointment not booked", error));
  }
});

AppRouter.patch("/cancel/:id", authmiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id).populate(
      "patientId",
      "email"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Invalid appointment ID" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const subject = "Appointment Canceled \u{274C}";
    const html = `
     <b>Appointment Details</b>
     <br>
     <b>Time - ${appointment.time}</b>
     <br>
     <b>Date - ${appointment.date}</b>
     <br>
     <b>Status - <span style="color: red;">cancelled</span></b>
     <br>
     <b>This Appointment was no longer, book new as needed</b>
     <br>
    `;

    const mail = sendMail(appointment.patientId?.email, subject, html);

    if (!mail) return new ThrowError(404, "Mail was not send");

    res
      .status(200)
      .json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return next(new ThrowError(500, "Failed to cancel appointment", error));
  }
});

AppRouter.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params;

    const doctor = await Doctor.findById({ userId: doctorId });

    if (!doctor) throw new ThrowError(404, "Invalid doctor ID");

    const appointment = await Appointment.find({ userId: doctorId }).populate(
      "doctorId",
      "name eamil"
    );

    res.status(200).json({
      appointment,
    });
  } catch (error) {
    return next(new ThrowError(500, "Doctor not find", error));
  }
});

AppRouter.post("/all", async (req, res, next) => {
  try {
    if (!(req.body?._id)) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const appointments = await Appointment.find({
      $or: [{ patientId: req.body._id }, { doctorId: req.body._id }],
    })
      .populate("doctorId", "name email")
      .populate("patientId", "name email");

    if (!appointments.length) {
      return res.status(404).json({ error: "No appointments found" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    return next(new ThrowError(500, "Appointments not found", error));
  }
});

export default AppRouter;
