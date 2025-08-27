import { User } from '../models/user.model.js';
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const register = async(req,res) => {

    try{
         const {email, name, password} = req.body;

        if(!email || !name || !password){
            return res.status(400).json({
                success : false,
                message:"All fields are required.",
            });
        }

        const registeredEmail = await User.findOne({email});

        if(registeredEmail){
            return res.status(400).json({
                success : false,
                message:"Email already exist with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            email,
            name,
            password:hashedPassword,
        }); 

        return res.status(201).json({
            success:true,
            message: "Account created successfully.  "
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            data:error.message,
        })
    }
    
}

export const login = async(req,res) => {

    try{
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Email and Password both are required."
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message: "Incorrect Email and Password"
            });
        }
        const isPasswordMatch = bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message: "Incorrect Email and Password"
            });
        }

        generateToken(res, user, `Welcome back ${user.name}`);

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message : "Failed to login",
            data:error.message
        })
    }
    
}

export const logout = (req,res) => {
    try{
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            success : true,
            message : "Logged out successfully.",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        })
    }
}

export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password",).populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Profile not found."
            })
        }
        return res.status(200).json({
                success : true,
                user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}

export const updateProfile = async(req, res) => {
    try{
        const {name} = req.body;
        const profilePhoto = req.file;
        const userId = req.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User  not found."
            })
        }
        // extract public id of the old image from the url if it exists
        if(user.photoUrl){
            // syntax :- / ke parts me divide kar dega array ke roop me last element ko pop kare usko two parts me split kar diye uska first part le liye.
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        //upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        //same syntax to do so :- const {secure_url:photoUrl} = cloudResponse;
        const photoUrl = cloudResponse.secure_url;
         
        const updatedData = {name, photoUrl};
        // password ko chor kar sab mil jayega
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser,
            message : "Profile updated Successfully."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user profile."
        })
    }
}