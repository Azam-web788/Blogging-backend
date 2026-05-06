import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import route from "./routes/userRoute.js"
import blogRoute from "./routes/blogRoute.js";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(cookieParser());

// ===== CORS (temporary for now) =====
app.use(cors({
  origin: "*",   // jab frontend ban jaye to isko change kar dena
  credentials: false
}));

// ===== Routes =====
app.use("/user", route);
app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("Server is Running 🚀");
});

// ===== DB Connection =====
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });

  } catch (error) {
    console.log("DB Error ❌", error.message);
  }
}

startServer();