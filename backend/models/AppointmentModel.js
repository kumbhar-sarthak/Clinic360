import mongoose  from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    reason: { type: String, required: true},
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);


export default Appointment;