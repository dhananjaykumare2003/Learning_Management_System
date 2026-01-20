import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export const generateToken = (res, user, message) => {
    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});

    return res
    .status(200)
    .cookie("token", token, {httpOnly:true, secure:true, maxAge:24*60*60*1000, sameSite:"none"})
    .json({
        success : true,
        message:message,
        user
    });
}