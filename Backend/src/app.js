import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/index.js";
import authRouter from "./routes/auth.routes.js";
import medicineRouter from "./routes/medicine.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
// app.use(cookieParser());

// Vercel/serverless often loads only this file — ensure Mongo connects before any DB query.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error(err);
        res.status(503).json({
            status: false,
            message: "Database unavailable",
        });
    }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});


// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/medicine", medicineRouter);

export default app;

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

// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(mongoSanitize());
// app.use(helmet());