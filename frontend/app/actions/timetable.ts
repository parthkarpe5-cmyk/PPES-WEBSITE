"use server";

import connectDB from "../../lib/db";
import { TimetableSession } from "../../lib/models/TimetableSession";
import { User } from "../../lib/models/User";
import { revalidatePath } from "next/cache";

/**
 * 1. ADMIN: Get all faculty for the table rows
 */
export async function getFacultyList() {
  await connectDB();
  const faculty = await User.find({ role: "faculty" }).select("name _id").lean();
  return JSON.parse(JSON.stringify(faculty));
}

/**
 * 2. ADMIN/FACULTY: Get the full master schedule
 */
export async function getWeeklyTimetable() {
  await connectDB();
  const data = await TimetableSession.find({}).lean();
  return JSON.parse(JSON.stringify(data));
}

/**
 * 3. STUDENT: Fetch schedule for a specific class (09 or 10)
 */
export async function getStudentTimetable(className: string) {
  await connectDB();
  const data = await TimetableSession.find({ 
    studentClass: className 
  }).sort({ date: 1, slotIndex: 1 }).lean();
  return JSON.parse(JSON.stringify(data));
}

/**
 * 4. ADMIN: Create or Update a slot (Handles Proxy & Merging)
 */
export async function upsertSlotAction(formData: FormData) {
  try {
    await connectDB();
    
    const facultyId = formData.get("facultyId") as string;
    const dateInput = formData.get("date") as string;
    const slotIdx = parseInt(formData.get("slotIndex") as string);
    
    // Find faculty name to ensure data integrity
    const faculty = await User.findById(facultyId);
    if (!faculty) return { error: "Faculty not found" };

    const data = {
      facultyName: faculty.name,
      facultyId: facultyId,
      date: new Date(dateInput),
      slotIndex: slotIdx,
      duration: parseInt(formData.get("duration") as string) || 1,
      studentClass: formData.get("studentClass"),
      subject: formData.get("subject"),
      isProxy: formData.get("isProxy") === "true",
      // Map slot index to human readable time
      startTime: ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"][slotIdx]
    };

    // Upsert logic: find by Faculty, Date, and Slot
    await TimetableSession.findOneAndUpdate(
      { facultyId: facultyId, date: data.date, slotIndex: slotIdx },
      data,
      { upsert: true }
    );

    revalidatePath("/dashboard/admin/timetable");
    revalidatePath("/dashboard/student/timetable");
    return { success: true };
  } catch (error: any) {
    console.error("Save Error:", error.message);
    return { error: "Failed to save slot" };
  }
}

/**
 * 5. FACULTY: Update Topic Name
 */
export async function updateTopicAction(formData: FormData) {
  try {
    await connectDB();
    const id = formData.get("sessionId");
    const topic = formData.get("topic") as string;

    await TimetableSession.findByIdAndUpdate(id, { topic: topic });

    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/student/timetable");
    return { success: true };
  } catch (error) {
    return { error: "Update failed" };
  }
}

/**
 * 6. FACULTY: Update Live Link
 */
export async function updateSessionAction(formData: FormData) {
  try {
    await connectDB();
    const id = formData.get("sessionId");
    const link = formData.get("liveLink") as string;
    const topic = formData.get("topic") as string;

    await TimetableSession.findByIdAndUpdate(id, { 
      liveLink: link,
      topic: topic 
    });

    revalidatePath("/dashboard/faculty");
    revalidatePath("/dashboard/student/timetable");
    return { success: true };
  } catch (error) {
    return { error: "Update failed" };
  }
}