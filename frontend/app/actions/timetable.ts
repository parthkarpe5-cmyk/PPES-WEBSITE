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
    const dateStr = formData.get("date") as string;
    const slotIdx = parseInt(formData.get("slotIndex") as string);
    const duration = parseInt(formData.get("duration") as string);
    const studentClass = formData.get("studentClass") as string;
    const subject = formData.get("subject") as string;
    const isProxy = formData.get("isProxy") === "true";

    // Get faculty name for the record
    const faculty = await User.findById(facultyId).select("name");
    if (!faculty) throw new Error("Faculty not found");

    const data = {
      facultyId,
      facultyName: faculty.name,
      date: new Date(dateStr),
      slotIndex: slotIdx,
      duration,
      studentClass,
      subject,
      isProxy,
      dayIndex: new Date(dateStr).getDay()
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
    console.error("❌ SAVE ERROR:", error.message);
    return { error: error.message };
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