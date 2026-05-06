import express from "express"
import  {create , deleteBlog, editBlog, SeeAllBlogs, SeeSingleBlog, SeeUserBlogs } from "../controller/blog.js"
import verification from "../middleware/verificationToken.js"
const blogRoute = express.Router()

blogRoute.post("/createBlog" , verification,  create)
blogRoute.put("/editBlog/:id" , verification,  editBlog)
blogRoute.delete("/deleteBlog/:id" , verification,  deleteBlog)
blogRoute.get("/singleBlog/:id" , verification,  SeeSingleBlog)
blogRoute.get("/userBlogs" , verification,  SeeUserBlogs)
blogRoute.get("/allBlogs" ,  SeeAllBlogs)

export default blogRoute