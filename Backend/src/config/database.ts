import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }
    console.log("Attempting to connect to MongoDB at:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");

    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      console.log(
        "Available collections:",
        collections.map((c) => c.name)
      );
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
