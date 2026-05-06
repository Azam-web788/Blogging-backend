import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import route from "../routes/userRoute.js";
import blogRoute from "../routes/blogRoute.js";

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true, // temporary
  credentials: true,
}));

// ===== Routes =====
app.use("/user", route);
app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ===== MongoDB Connection (IMPORTANT) =====
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URL);
  isConnected = true;
  console.log("MongoDB Connected ✅");
}

// 👇 Ye har request pe chalega (serverless ke liye sahi hai)
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}