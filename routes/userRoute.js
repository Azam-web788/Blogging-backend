import express from "express";
const route = express.Router()
import {EditUser, GetallUsers, Login, Logout, Register, SingleUser} from "../controller/user.js"
route.post("/register" , Register)
route.post("/login" , Login)
route.get("/logout" , Logout)
route.get("/singleuser/:id" , SingleUser)
route.put("/edituser/:id" , EditUser)
route.get("/getAllusers" , GetallUsers)
export default route