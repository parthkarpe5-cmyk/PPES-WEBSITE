import mongoose from "mongoose";

// This schema defines how a User is stored in MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Hashed password
  role: { type: String, enum: ["admin", "faculty", "student"], required: true },
  
  // USN: PPG26S10-001
  usn: { type: String, unique: true, sparse: true }, 
  
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// IMPORTANT: This line EXPORTS the User model so other files can use it
export const User = mongoose.models.User || mongoose.model("User", UserSchema);