import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connection is successfull!");
    }catch(e){
        console.log("error occured", e);
    }
}

export default dbConnect;