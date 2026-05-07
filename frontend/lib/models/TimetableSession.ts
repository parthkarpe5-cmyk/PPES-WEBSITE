import mongoose from "mongoose";

const TimetableSessionSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  facultyId: { type: String, required: true },
  dayIndex: { type: Number, required: true }, // 0-6
  date: { type: Date, required: true },       // Actual Date
  slotIndex: { type: Number, required: true }, // 0=8AM
  duration: { type: Number, default: 1 },      // 1 or 2 (Merge)
  studentClass: { type: String, enum: ["09", "10"], required: true },
  subject: { type: String, required: true },
  topic: { type: String, default: "" },
  liveLink: { type: String, default: "" },    // Teacher updates this
  isProxy: { type: Boolean, default: false }
});

export const TimetableSession = mongoose.models.TimetableSession || mongoose.model("TimetableSession", TimetableSessionSchema);