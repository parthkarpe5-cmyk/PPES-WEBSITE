"use server";

import connectDB from "../../lib/db";
import { TimetableSession } from "../../lib/models/TimetableSession";
import { User } from "../../lib/models/User";
import { revalidatePath } from "next/cache";

// 🚀 HELPER: Ensures date is saved at exactly 00:00:00 local time
const normalizeDate = (dateInput: string) => {
  const [year, month, day] = dateInput.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export async function getFacultyList() {
  await connectDB();
  const faculty = await User.find({ role: "faculty" }).select("name").lean();
  return JSON.parse(JSON.stringify(faculty));
}

export async function getWeeklyTimetable() {
  await connectDB();
  const data = await TimetableSession.find({}).lean();
  return JSON.parse(JSON.stringify(data));
}

export async function getFacultyTimetableByName(name: string) {
  await connectDB();
  // Fetch ALL sessions for this teacher (removing the week filter for now to ensure visibility)
  const data = await TimetableSession.find({ facultyName: name }).sort({ date: 1 }).lean();
  return JSON.parse(JSON.stringify(data));
}

export async function getStudentTimetable(className: string) {
  await connectDB();
  // Fetch ALL sessions for this class (removing the week filter for now to ensure visibility)
  const data = await TimetableSession.find({ studentClass: className }).sort({ date: 1 }).lean();
  return JSON.parse(JSON.stringify(data));
}

export async function upsertSlotAction(formData: FormData) {
  try {
    await connectDB();
    const facultyName = formData.get("facultyName") as string;
    const dateInput = formData.get("date") as string; // "YYYY-MM-DD"
    const slotIdx = parseInt(formData.get("slotIndex") as string);

    const localDate = normalizeDate(dateInput);

    const data = {
      facultyName,
      facultyId: "name_link_mode",
      date: localDate,
      slotIndex: slotIdx,
      duration: parseInt(formData.get("duration") as string) || 1,
      studentClass: formData.get("studentClass"),
      subject: formData.get("subject"),
      startTime: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"][slotIdx]
    };

    // Use Name + Date + Slot as the unique key
    await TimetableSession.findOneAndUpdate(
      { facultyName, date: localDate, slotIndex: slotIdx },
      data,
      { upsert: true }
    );

    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/student/timetable");
    return { success: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { error: "Failed to update" };
  }
}

export async function updateTopicAction(formData: FormData) {
  await connectDB();
  const id = formData.get("sessionId");
  const topic = formData.get("topic");
  await TimetableSession.findByIdAndUpdate(id, { topic });
  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/student/timetable");
  return { success: true };
}