import mongoose from "mongoose";

const blogModel = mongoose.Schema({
    name : {
        type : String
    },
    image : {
        type : String,
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    userid : {
        type : String
    }
})

const Blog = mongoose.model("blogs" , blogModel)
export default Blog