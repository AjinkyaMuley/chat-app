import jwt, { decode } from "jsonwebtoken"
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({error : "Unauthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);  //need JWT_SECRET TO DECODE BACK THIS TOKEN

        if(!decoded){
            return res.status(401).json({error : "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error : "User not found"})
        }

        req.user = user;

        next();  //next function called so that it could give control to the next function in para in message.routes.js file router.post("/send/:id", protectRoute, sendMessage);

    } catch (error) {
        console.log("error in protectroute middleware " , error.message)
        res.status(500).json({error : "internal server error"})
    }
}

export default protectRoute