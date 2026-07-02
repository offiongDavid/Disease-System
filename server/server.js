import dotenv from "dotenv";
dotenv.config();



import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use(
  "/api/students",
  studentRoutes
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));