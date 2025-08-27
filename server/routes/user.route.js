import express from "express";
const userRouter = express.Router();

import { getUserProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

// userRouter.route("/login").post(login); ---Alternate syntax.
userRouter.post("/login", login);
userRouter.post("/signup", register);
userRouter.post("/logout", logout);
userRouter.get("/profile", isAuthenticated, getUserProfile);
userRouter.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile);

export default userRouter; 