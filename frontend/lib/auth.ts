import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      name: string;
      usn?: string; // Included for students
    };
    return decoded;
  } catch (err) {
    return null;
  }
}