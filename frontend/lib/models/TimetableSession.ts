import mongoose from "mongoose";

// Force a clean model build
if (mongoose.models.TimetableSession) {
  delete mongoose.models.TimetableSession;
}

const TimetableSessionSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  facultyId: { type: String, required: true }, // Ensure this is a String
  date: { type: Date, required: true },
  slotIndex: { type: Number, required: true },
  duration: { type: Number, default: 1 },
  studentClass: { type: String, enum: ["09", "10"], required: true },
  subject: { type: String, required: true },
  topic: { type: String, default: "" },
  startTime: { type: String },
  liveLink: { type: String, default: "" }
});

export const TimetableSession = mongoose.model("TimetableSession", TimetableSessionSchema);