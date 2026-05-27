"use server";
import connectDB from "../../lib/db";
import { ClassSession } from "../../lib/models/ClassSession";
import { revalidatePath } from "next/cache";

// Fetch classes assigned to a specific faculty name
export async function getFacultySessions(name: string) {
  await connectDB();
  return await ClassSession.find({ facultyName: name }).sort({ date: 1 }).lean();
}

// Accept class and add a custom message
export async function acceptClassAction(id: string, message: string) {
  await connectDB();
  try {
    await ClassSession.findByIdAndUpdate(id, {
      status: "accepted",
      scheduledMessage: message // You'll need to add this field to your model (see below)
    });
    revalidatePath("/dashboard/faculty");
    return { success: true };
  } catch (error) {
    return { error: "Failed to accept" };
  }
}
export async function getFacultyWeeklyTimetable(facultyId: string) {
  await connectDB();
  
  // Fetch all sessions for this specific teacher
  const data = await TimetableSession.find({ 
    facultyId: facultyId 
  }).sort({ dayIndex: 1, slotIndex: 1 }).lean();

  return JSON.parse(JSON.stringify(data));
}
