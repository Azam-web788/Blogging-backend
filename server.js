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
  origin: "*"
}));

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is missing in .env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

async function connectDB() {
  if (cached.conn) {
    console.log("⚡ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((m) => m);
  }

  cached.conn = await cached.promise;

  console.log("✅ MongoDB Connected");
  return cached.conn;
}
connectDB();
app.use("/user", userRoute);
app.use("/blogs", blogRoute);


app.get("/", (req, res) => {
  res.send("Server is Running 🚀");
});

export default app;