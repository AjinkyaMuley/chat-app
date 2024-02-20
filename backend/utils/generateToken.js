import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET , {expiresIn: '15d'})  // expires in 15 days

    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,   // 15 Days in ms
        httpOnly : true, //prevent XSS attacks cross site scripting attacks
        sameSite: "strict",  //CSRF attacks cross-site request fogery attacks
        secure : process.env.NODE_ENV !=="development"
    })
}


export default generateTokenAndSetCookie;
