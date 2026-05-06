import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "https://blogging-app-f18.vercel.app"],
  credentials: true
}));

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is missing in .env file");
}


async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return; 
    }
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    throw error;
  }
}


app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

app.use("/user", userRoute);
app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("Server is Running 🚀");
});

export default app;