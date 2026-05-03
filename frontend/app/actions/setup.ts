"use server";

import connectDB from "../../lib/db";
import { User } from "../../lib/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// 1. Configure the email sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. SEND OTP ACTION
export async function sendOtpAction(email: string) {
  await connectDB();
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: `"Prarambha Path" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code - Prarambha Path",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #E8F6FA; border-radius: 15px;">
          <h2 style="color: #2FA8CC;">Scholar Activation</h2>
          <p>Your verification code is: <b style="font-size: 24px; color: #1F4E79;">${otp}</b></p>
          <p>Use this code to activate your portal account.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { error: "Failed to send email." };
  }
}

// 3. REGISTER STUDENT ACTION (PPG26S Pattern)
export async function registerStudentAction(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const studentClass = formData.get("class") as string; // "09" or "10"
    
    // Pattern: PPG + 26 (Year) + S (Student)
    const prefix = "PPG26S"; 
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return { error: "Email already registered." };

    // Count students in that class to get the sequence
    const usnSearchPattern = `${prefix}${studentClass}-`;
    const studentCount = await User.countDocuments({ 
      usn: { $regex: `^${usnSearchPattern}` } 
    });
    
    const sequence = (studentCount + 1).toString().padStart(3, '0');
    const generatedUsn = `${prefix}${studentClass}-${sequence}`;

    const newUser = new User({
      userId: generatedUsn, // Use USN as the unique identifier
      name,
      email,
      role: "student",
      usn: generatedUsn,
      isVerified: false,
    });

    await newUser.save();
    
    // After saving, send the OTP email
    return await sendOtpAction(email); 
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Registration failed." };
  }
}

// 4. COMPLETE SETUP ACTION (This was missing!)
export async function completeSetupAction(formData: FormData) {
  try {
    await connectDB();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email: email },
      { 
        password: hashedPassword, 
        isVerified: true 
      },
      { new: true }
    );

    if (!user) return { error: "User update failed." };

    return { success: true };
  } catch (error) {
    console.error("Setup Error:", error);
    return { error: "Database error occurred." };
  }
}