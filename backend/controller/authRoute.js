import { Router } from "express";
import User from "../models/authModel.js";
import jwt from "jsonwebtoken";
import authmiddleware from "../middleware/auth.middleware.js";
import ThrowError from "../utility/ErrorHandler.js";
import Doctor from "../models/DoctorModel.js"

const AuthRouter = Router();

const generateTokens = async (user) => {
  const AccessToken = await user.generateAccessToken(user?._id);
  const RefreshToken = await user.generateRefreshToken(user?._id);

  return { AccessToken, RefreshToken };
};

AuthRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if ([name, email, password, role].some((i) => i === undefined || i === null))
    throw new ThrowError(404, "The filed was missing");

  try {
    let user = await User.findOne({ email });

    if (user) throw new ThrowError(404, "User Already Exisit !!");

    user = new User({
      name,
      email,
      password,
      role,
    });

    const { RefreshToken, AccessToken } = await generateTokens(user);

    if (!RefreshToken || !AccessToken) {
      throw new ThrowError(402, "Token Not Genrated");
    }

    user.refreshtoken = RefreshToken;
    await user.save();

    res
      .status(200)
      .cookie("refreshToken", RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .cookie("accessToken", AccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .json({ user });
  } catch (error) {
    throw new ThrowError(404, "User Registration Failed", error);
  }
});

AuthRouter.post("/register/doctor", async (req, res) => {
  const { name, email, password, role, specialty, experience,location, availability } = req.body;

  
  if ([name, email, password, role, specialty, experience,location,availability].some((i) => i === undefined || i === null))
    throw new ThrowError(404, "The filed was missing");

  try {
    let user = await User.findOne({ email });

    if (user) throw new ThrowError(404, "User Already Exisit !!");

    user = new User({
      name,
      email,
      password,
      role,
    });

    const doctor = new Doctor({
      userId: user._id,
      specialty,
      experience,
      location,
      availability,
    })

    

    const { RefreshToken, AccessToken } = await generateTokens(user);

    if (!RefreshToken || !AccessToken) {
      throw new ThrowError(402, "Token Not Genrated");
    }

    user.refreshtoken = RefreshToken;
    await user.save();
    await doctor.save();

    res
      .status(200)
      .cookie("refreshToken", RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .cookie("accessToken", AccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .json({ user, doctor });
  } catch (error) {
    throw new ThrowError(404, "User Registration Failed", error);
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ThrowError(401, "Login fields are required");

  try {
    const user = await User.findOne({ email });

    if (!user) throw new ThrowError(404, "User Not Register");

    const isvalid = await user.comparePassword(password);

    if (!isvalid) throw new ThrowError(404, "Pasword incorrect");

    const { RefreshToken, AccessToken } = await generateTokens(user);

    if (!RefreshToken || !AccessToken)
      throw new ThrowError(404, "Tokens Not Created");

    user.refreshtoken = RefreshToken;

    await user.save();

    res
      .status(200)
      .cookie("refreshToken", RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .cookie("accessToken", AccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      })
      .json({ user });
  } catch (error) {
    throw new ThrowError(404, "Login Failed", error);
  }
});

AuthRouter.post("/logout", async (req, res, next) => {
  try {

    const refreshToken  = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return next(new ThrowError(404, "Refresh Token is required for logout"));
    }

    const user = await User.findOne({ refreshtoken: refreshToken });
    if (!user) {
      return next(new ThrowError(401, "Invalid Refresh Token"));
    }

    await User.updateOne({ _id: user._id }, { $unset: { refreshtoken: "" } });

    res
      .status(200)
      .clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .json({ message: "Logout Successful" });

  } catch (error) {
    console.error("Logout error:", error);
    return next(new ThrowError(500, "Server Error", error));
  }
});


AuthRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const refreshtoken = refreshToken;

  try {
    const user = await User.findOne({ refreshtoken });


    jwt.verify(refreshtoken, process.env.JWT_SEC, () => {
      const newAccessToken = user.generateAccessToken();

      res
      .status(200)
      .cookie("accessToken",newAccessToken,{
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .json({
        user
      })
    });
  } catch (error) {
    throw new ThrowError(404, "Refresh Failed", error);
  }
});

AuthRouter.get("/me", authmiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    throw new ThrowError(404, "User Not Found", error);
  }
});

AuthRouter.get("/profile", authmiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    throw new ThrowError(404, "User Not Found", error);
  }
}
);

export default AuthRouter;
