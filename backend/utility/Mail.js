import nodemailer from "nodemailer";
import ThrowError from "./ErrorHandler.js";
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_MAIL_PASS, 
  },
  debug: true,
});

const sendMail = async (to,subject,html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MY_MAIL, 
      to: to, 
      subject: subject,
      html: html, 
    });

    return info.messageId;
  } catch (error) {
    console.error("Error sending email: ", error);
    return new ThrowError(404,"Email not Send",error);
    
  }
};

export default sendMail;
