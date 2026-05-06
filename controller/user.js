import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Blog from "../models/blogModel.js";

dotenv.config();

// ================= REGISTER =================
const Register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phonenumber,
    instagramUrl,
    linkedinUrl,
    image,
    about,
    role
  } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  try {
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !phonenumber ||
      !about ||
      !image ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
        success: false
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        message: "User already exists",
        success: false
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      image,
      password: hashPassword,
      phonenumber,
      about,
      role,
      instagramUrl,
      linkedinUrl
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
      success: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

// ================= LOGIN =================
const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        image: user.image
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user._doc;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "User login successfully",
      user: safeUser,
      token,
      success: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

const Logout = async (req, res) => {
  res.clearCookie("token").status(200).json({
    message: "User logout successfully",
    success: true
  });
};

const SingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    const blog = await Blog.find({ userid: user._id });

    res.status(200).json({
      message: "Single user fetched",
      user,
      blog
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

const EditUser = async (req, res) => {
  const id = req.params.id;

  const {
    firstname,
    lastname,
    email,
    phonenumber,
    instagramUrl,
    linkedinUrl,
    image,
    role
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        email,
        phonenumber,
        instagramUrl,
        linkedinUrl,
        image,
        role
      },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user,
      success: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

const GetallUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    res.status(200).json({
      message: "All users fetched",
      allUsers
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

export {
  Register,
  Login,
  Logout,
  SingleUser,
  EditUser,
  GetallUsers
};