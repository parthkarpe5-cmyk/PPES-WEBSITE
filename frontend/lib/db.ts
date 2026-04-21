import mongoose from "mongoose";

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ ERROR: MONGODB_URI is undefined! Check your .env.local file location.");
    throw new Error("URI Missing");
  }

  try {
    // This will print the first few characters of your URI so we can check if it's loading
    console.log("🔗 Connecting to:", uri.substring(0, 20) + "..."); 

    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error: any) {
    console.error("❌ REAL ERROR MESSAGE:", error.message);
    throw new Error("Failed to connect to Database");
  }
}