"use server";

import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

export async function loginAction(formData: FormData, role: string) {
  const email = formData.get("identifier") as string;
  const password = formData.get("password") as string; // Password ignored for now per dev request
  const cookieStore = await cookies();

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Login failed" };
    }

    // Generate a simple JWT for the session
    const secret = process.env.JWT_SECRET || "default_secret";
    const token = sign(
      { userId: data.user.id, role: data.user.role, name: data.user.name },
      secret,
      { expiresIn: "24h" }
    );

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    // Set a client-readable cookie for the UI (not httpOnly)
    cookieStore.set("user-data", JSON.stringify(data.user), {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "Connection to server failed" };
  }
}