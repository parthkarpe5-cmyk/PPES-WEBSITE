import mongoose from "mongoose";

// 1. CLEAR CACHE: This forces Mongoose to use the new schema below
if (mongoose.models.ClassSession) {
  delete mongoose.models.ClassSession;
}

const ClassSessionSchema = new mongoose.Schema({
  // Use studentClass to match your logs
  studentClass: { type: String, required: true }, 
  facultyName: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  
  // Make these completely optional (no 'required' tag)
  endTime: { type: String }, 
  facultyId: { type: String },
  scheduledMessage: { type: String, default: "" }, 
  status: { type: String, default: "pending" } // Set default to pending for faculty to accept
});

export const ClassSession = mongoose.model("ClassSession", ClassSessionSchema);