import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  role: { type: String, enum: ["admin", "faculty", "student"], required: true },
  
  // UNIQUE: TRUE ensures no two students have the same USN
  // SPARSE: TRUE allows Faculty/Admins to have NO usn without causing an error
  usn: { type: String, unique: true, sparse: true }, 
  
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);