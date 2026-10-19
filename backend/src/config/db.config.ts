import mongoose from "mongoose";
import config from "../config/app.config.js";


const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
    } catch (error) {
        console.error(`[!] Error While Connecting MongoDB ----  ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;