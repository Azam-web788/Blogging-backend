import mongoose from "mongoose";

const userModel = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    phonenumber : {
        type : String,
        required : true
    },
    about : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    instagramUrl : {
        type : String,
    },
    linkedinUrl : {
        type : String,
    },
})

const User = mongoose.model("users" , userModel)
export default User