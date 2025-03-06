import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialty: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  availability: {type: String,required: true},
});

const Doctor = mongoose.model("Doctor", DoctorSchema);


export default Doctor;