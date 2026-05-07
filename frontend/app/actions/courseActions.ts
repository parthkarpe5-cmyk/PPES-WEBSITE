"use server";

import connectDB from "../../lib/db";
import { Course } from "../../lib/models/Course"; // Added this missing import
import { Subject } from "../../lib/models/Subject"; // Added this missing import
import { User } from "../../lib/models/User";
import { revalidatePath } from "next/cache";

/**
 * 1. Create a Subject and map it to a Faculty and Course Name
 */
export async function createSubjectAction(formData: FormData) {
  try {
    await connectDB();
    const facultyId = formData.get("facultyId") as string;
    const faculty = await User.findById(facultyId);
    
    if (!faculty) return { error: "Faculty not found" };

    const newSubject = new Subject({
      title: formData.get("title"),
      courseName: formData.get("courseName"),
      facultyId: facultyId,
      facultyName: faculty.name
    });

    await newSubject.save();
    revalidatePath("/dashboard/admin/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create subject" };
  }
}

/**
 * 2. Create a Course Template (Bundles multiple subjects)
 */
export async function createCourseAction(formData: FormData) {
  try {
    await connectDB();
    const subjectIds = formData.getAll("subjectIds");

    const newCourse = new Course({
      title: formData.get("title"),
      description: formData.get("description"),
      targetClass: formData.get("targetClass"), // Capture the new field
      subjects: subjectIds
    });

    await newCourse.save();
    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/dashboard/student/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create course" };
  }
}

/**
 * 3. Fetch all courses with populated subjects
 */
export async function getAllCourses() {
  await connectDB();
  try {
    // Populate the subjects array so we get full subject details
    const courses = await Course.find().populate("subjects").lean();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error("Fetch Courses Error:", error);
    return [];
  }
}

// Helpers for the Admin UI Dropdowns
export async function getFacultyForDropdown() {
  await connectDB();
  const faculty = await User.find({ role: "faculty" }).select("name _id").lean();
  return JSON.parse(JSON.stringify(faculty));
}

export async function getSubjectsForDropdown() {
  await connectDB();
  const subjects = await Subject.find().select("title _id").lean();
  return JSON.parse(JSON.stringify(subjects));
}