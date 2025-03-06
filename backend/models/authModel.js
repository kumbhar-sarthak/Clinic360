import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, length: 6 },
  role: { type: String, enum: ["doctor", "patient"], required: true },
  refreshtoken : { type: String, required : true },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SEC,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

UserSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SEC,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}


UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;