import jwt from "jsonwebtoken";
import ThrowError from "../utility/ErrorHandler.js";
import User from "../models/authModel.js"

const authmiddleware = async (req, res, next) => {
  try {
    
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) throw new ThrowError(404, "Token missing");

    let decoded;  

    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SEC);
    } catch (err) {
      console.error("JWT Verification Error:", err);
      throw new ThrowError(404, "Token Verification Failed", err);
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ThrowError(404, "User not found");

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    next(error);  // Pass error to Express error handler
  }
};

export default authmiddleware;
