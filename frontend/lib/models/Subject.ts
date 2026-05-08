import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  title: { type: String, required: true },         // e.g., "Algebra"
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyName: { type: String, required: true },   // Direct storage
  courseName: { type: String, required: true }    // Direct storage (e.g., "Bridge Course")
  
});

export const Subject = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);