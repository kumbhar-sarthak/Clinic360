import express from 'express'
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
const allowedOrigins = [
  "http://localhost:5173", 
  process.env.FRONTEND_APP_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,"views")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "server.html"));
});

app.use("/api",router);


export default app;