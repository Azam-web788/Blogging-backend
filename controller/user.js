import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import Blog from "../models/blogModel.js"
const Register = async (req , res) => {
 const {firstname , lastname , email , password , phonenumber , instagramUrl , linkedinUrl , image , about , role} = req.body
 const emailRegix = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
 try {
    if (!firstname || !lastname || !email || !password || !phonenumber || !about || !image || !role) {
        return res.status(400).json({
            message : "All fields are required",
            success : false
        })
    }
    if (!emailRegix.test(email)) {
        return res.status(402).json({
            message : "invalid email",
            success : false
        })
    }
    if (password.length < 6) {
        return res.status(404).json({
            message : "password must be at least 6 characters",
            success : false
        })
    }
    const existingEmail = await User.findOne({email})
    if (existingEmail) {
        return res.status(403).json({
          message : "user already existed",
          success : false
        })
    }
    const hashPassword = await bcrypt.hash(password , 10)
    const user = await User({
        firstname, 
        lastname, 
        email,
        image,
        password : hashPassword,
        phonenumber,
        about,
        role,
        instagramUrl, 
        linkedinUrl
    })
   await user.save()
    res.status(200).json({
        message : "user registered successfully",
        user,
        success : true
    })
 } catch (err) {
    console.log(err);
    res.status(500).json({
        message : err.message,
        success : false
    })
 }
}
const Login = async function (req , res) {
    const {email , password} = req.body
     try {
    if (!email || !password) {
        return res.status(400).json({
            message : "All fields are required",
            success : false
        })
    }
    const user = await User.findOne({email})
    if (!user) {
        res.status(403).json({
          message : "incorrect email or password",
          success : false
        })
        console.log("incorrect email");
        return
    }
    const ispassword = await bcrypt.compare(password , user.password)
    if (!ispassword) {
         res.status(404).json({
            message : "incorrect email or password",
            success : false
        })
        console.log("incorrect password");
        return
    }
    const token = jwt.sign({ FirstName: user.firstname , image : user.image ,  Email : user.email ,  id : user._id }, process.env.JWT_SECRET);
    res.cookie("token" , token , {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",
        sameSite : "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        message : "user login successfully",
        user,
        token,
        success : true
    })
 } catch (err) {
    console.log(err);
    res.status(500).json({
        message : err.message,
        success : false
    })
 }
}
async function Logout(req , res) {
    res.cookie("token" , "").status(200).json({
        message : "user logout sccessfully",
        success : true
    })
}
const SingleUser = async function (req , res) {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        const blog = await Blog.find({userid : user._id})
        res.status(200).json({
            message : "single user",
            blog,
            user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
const EditUser = async function (req , res) {
    const id = req.params.id
    const {firstname , lastname , email , phonenumber , instagramUrl , linkedinUrl , image , role} = req.body
    try {
        const user = await User.findByIdAndUpdate(id , {firstname , lastname , email , phonenumber , instagramUrl , linkedinUrl , role , image} , {new : true})
        res.status(200).json({
            message : "User edit successfully",
            user,
            success : true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
const GetallUsers = async (req , res) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({
            message : "All users",
            allUsers
        })
    } catch (err) {
      console.log(err);
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
export {Register , Login , Logout , SingleUser , EditUser , GetallUsers}