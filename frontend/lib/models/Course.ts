import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Relational array
  targetClass: { type: String, enum: ["09", "10", "Both"], default: "Both" }
});

export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);