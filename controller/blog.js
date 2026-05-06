import Blog from "../models/blogModel.js"
import User from "../models/userModel.js"

const create = async (req , res) => {
    const {title , description , thumbnail} = req.body
    const userId = req.userId
    try {
        const user = await User.findById(userId)
        if (!title || !description || !thumbnail) {
            return res.status(400).json({
                message : "all fields are required",
                success : false
            })
        }
        const blog = await Blog.create({
            image : user.image,
            name : user.firstname,
            thumbnail,
            title,
            description,
            userid : user._id
        })
        blog.save()
        res.status(200).json({
            message : "blog created successfully",
            blog,
            success : true
        })
    } catch (err) {
        res.status(500).json({
            message : err.message,
            succesws : false
        })        
    }
}
const editBlog = async function (req , res) {
    const {title , description , thumbnail} = req.body
    const id = req.params.id
    const userId = req.userId
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).json({
                message : "no blog found",
                success : false
            })
        }
        if (blog.userid !== userId) {
            return res.status(404).json({
                message : "user blog no found",
                success : false
            })
        }
        const obj = {
            title,
            description,
            thumbnail
        }
        const editblog = await Blog.findByIdAndUpdate(id , obj , {new : true})
        res.status(200).json({
            message : "blog edit successfully",
            editblog,
            success : true
        })
    } catch (error) {
        res.status(500).json({
            message : error.message,
            success : false
        })
    }
}
const deleteBlog = async function (req , res) {
    const id = req.params.id
    const userId = req.userId
    try {
        const blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).json({
                message : "no blog found",
                success : false
            })
        }
        if (blog.userid !== userId) {
            return res.status(404).json({
                message : "user blog no found",
                success : false
            })
        }
        const deleteblog = await Blog.findByIdAndDelete(id)
        res.status(200).json({
            message : "blog deleted successfully",
            deleteblog,
            success : true
        })
    } catch (error) {
        res.status(500).json({
            message : error.message,
            success : false
        })
    }
}
async function SeeSingleBlog(req , res) {
        const id = req.params.id
    try {
        const singleBlog = await Blog.findById(id)
        res.status(200).json({
            message : 'single blog',
            singleBlog,
            success : true
        })
    } catch (err) {
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
async function SeeUserBlogs(req , res) {
        const userId = req.userId
    try {
        const userBlogs = await Blog.find({userid : userId})
        res.status(200).json({
            message : 'User blogs',
            userBlogs,
            success : true
        })
    } catch (err) {
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
const SeeAllBlogs = async (req , res) => {
    try {
        const allBlogs = await Blog.find()
        res.status(200).json({
            message : "All Blogs",
            allBlogs,
            success : true
        })
    } catch (err) {
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
export {create , editBlog , deleteBlog , SeeSingleBlog , SeeUserBlogs , SeeAllBlogs}