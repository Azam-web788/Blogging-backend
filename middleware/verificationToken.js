import jwt  from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
const verification = async (req , res , next) => {
    const token = req.cookies.token
    console.log(token);
    try {
        if (!token) {
            return res.status(404).json({
                message : "unauthorized user",
                success : false
            })
        }
        const decode = await jwt.verify(token , process.env.JWT_SECRET)
        console.log(decode);
        req.userId = decode.id
        next()
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message : err.message,
            success : false
        })
    }
}
export default verification