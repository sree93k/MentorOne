import mongoose from "mongoose";
import { seedChatbotData } from "./seedChatbotData";
import dotenv from "dotenv";

dotenv.config();

async function runSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("📊 Connected to MongoDB");

    // Run seeding
    const result = await seedChatbotData();
    console.log("🎉 Seeding completed:", result);

    // Disconnect
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeed();
}

export { runSeed };
