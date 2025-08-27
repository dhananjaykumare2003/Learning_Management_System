import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async(req, res,next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                status : false,
                message : "User not authenticated",
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                success : false,
                message : "Invalid token",
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);  
        res.send(500).json({
            success : false,
            message :"Unable to authenticate."
        })
    }
    
}

export default isAuthenticated;