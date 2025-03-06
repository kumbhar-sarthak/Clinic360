import express, { urlencoded } from 'express'
import cors from 'cors'
import router from './routes/Router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import helmet from 'helmet';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({
  extended: true,
}))
app.use(cors({
  origin: process.env.FRONTEND_APP_URL || "http://127.0.0.1:5173",
  credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,"views")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "server.html"));
});

app.use("/api",router);


export default app;