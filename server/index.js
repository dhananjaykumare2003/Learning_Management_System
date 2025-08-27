import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/database.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js"
import purchaseRoute from "./routes/coursePurchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
const app = express();


const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

//importing and mounting routes
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

//dbConnect
dbConnect();

app.get('/', (req,res) => {
    res.send("Hello Friends");
});

app.listen(PORT, () => {
    console.log(`App is running successfully at PORT : ${PORT}`);
})