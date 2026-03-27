import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import medicineRouter from "./routes/medicine.routes.js";
import { isDbConnected } from "./db/index.js";
const app = express();

// Middleware Configurations – allow frontend (Expo web) origins
// const allowedOrigins = [
//   "http://localhost:19006",
//   "http://127.0.0.1:8081",
//   "http://127.0.0.1:19006",
//   "exp://192.168.0.105:8081",
//   ...(process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN.replace(/^"|"$/g, "")] : []),
// ];
// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
//     if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) return cb(null, true);
//     cb(null, false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", async (req, res, next) => {
  if (isDbConnected()) return next();
  try {
    await ensureConnection();
  } catch (err) {
    console.error("[DB] ensureConnection failed:", err.message);
    return res.status(503).json({
      status: false,
      message: "Database is not ready. Please try again in a moment.",
    });
  }
  if (!isDbConnected()) {
    return res.status(503).json({
      status: false,
      message: "Database is not ready. Please try again in a moment.",
    });
  }
  next();
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/medicine", medicineRouter);

export default app;

// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(mongoSanitize());
// app.use(helmet());