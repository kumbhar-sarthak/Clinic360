import express from "express"
import AuthRouter from "../controller/authRoute.js";
import DoctorRouter from "../controller/doctorRoute.js";
import AppRouter from "../controller/appointmentRoute.js";


const router = express.Router();


router.use('/auth',AuthRouter);
router.use('/appointment',AppRouter);
router.use('/doctor',DoctorRouter);

export default router;