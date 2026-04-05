import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = 3000;

const app = express();
dotenv.config();

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";

const allowedOrigins = [
  "http://localhost:5173", // for dev
];
app.use(
  cors({
    origin: allowedOrigins, // allow all origins
    credentials: true, // cannot use `true` with "*"
  })
);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("hi I am backend");
});

app.use((err, req, res, next) => {
  console.error("Caught Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message, success: false, statusCode });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
