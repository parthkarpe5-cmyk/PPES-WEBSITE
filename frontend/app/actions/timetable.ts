"use server";
import connectDB from "../../lib/db";
import { ClassSession } from "../../lib/models/ClassSession";
import { revalidatePath } from "next/cache";

export async function assignClassAction(prevState: any, formData: FormData) {
  try {
    await connectDB();

    const data = {
      facultyName: formData.get("facultyName") as string,
      studentClass: formData.get("studentClass") as string,
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      date: new Date(formData.get("date") as string),
      startTime: formData.get("startTime") as string,
      // Provide dummy data for non-form fields to satisfy Mongoose
      endTime: "N/A",
      facultyId: "standalone_user",
      status: "accepted"
    };

    console.log("💾 FINAL DATA FOR DB:", data);

    const newSession = new ClassSession(data);
    await newSession.save();
    
    console.log("✅ SUCCESS: Document saved!");
    
    revalidatePath("/dashboard/student/timetable");
    return { success: true };
  } catch (error: any) {
    console.error("❌ SAVE ERROR:", error.message);
    return { error: error.message };
  }
}

export async function getStudentTimetable(className: string) {
  await connectDB();
  // Ensure we search by 'studentClass'
  return await ClassSession.find({ studentClass: className }).sort({ date: 1 }).lean();
}