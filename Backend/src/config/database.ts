import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(mongoUri)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
    }
}