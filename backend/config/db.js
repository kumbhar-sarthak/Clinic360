import mongoose from "mongoose";
import ThrowError from "../utility/ErrorHandler.js"

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connected ⚙")
  } catch (error) {
    ThrowError(401,"DB Connection failed",error);
  }
}

export default connect