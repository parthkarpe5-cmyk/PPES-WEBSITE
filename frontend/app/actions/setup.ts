"use server";

import connectDB from "../../lib/db";
import { User } from "../../lib/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// 1. Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Helper: Sends the final credentials to the student
 */
async function sendWelcomeEmail(email: string, usn: string, password: string) {
  try {
    await transporter.sendMail({
      from: `"Prarambha Path" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Registration Successful - Your Login Credentials",
      html: `
        <div style="font-family: sans-serif; padding: 30px; background-color: #E8F6FA; border-radius: 20px; border: 2px solid #2FA8CC; max-width: 500px; margin: auto;">
          <h1 style="color: #1F4E79; text-align: center;">Welcome to the Academy!</h1>
          <p style="color: #1F4E79; text-align: center;">Your account is now active. Please save these details for your login:</p>
          
          <div style="background: white; padding: 25px; border-radius: 15px; margin-top: 20px; border: 1px dashed #2FA8CC;">
            <p style="margin: 10px 0; font-size: 14px; color: #64748b;">STUDENT USN:</p>
            <h2 style="color: #2FA8CC; font-size: 24px; margin: 0;">${usn}</h2>
            
            <p style="margin: 20px 0 10px 0; font-size: 14px; color: #64748b;">PASSWORD:</p>
            <h2 style="color: #FF6B00; font-size: 24px; margin: 0;">${password}</h2>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #1F4E79; font-size: 14px; margin-bottom: 20px;">You can now log in to access your classes and events.</p>
            <a href="http://localhost:3000/login/student" style="background-color: #2FA8CC; color: white; padding: 15px 25px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Login to Portal</a>
          </div>

          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 30px;">Prarambha Path Digital Learning System</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Welcome Email Failed:", error);
  }
}

/**
 * Action: Send OTP & USN
 */
export async function sendOtpAction(email: string, usn?: string) {
  await connectDB();
  let studentUsn = usn;
  if (!studentUsn) {
    const user = await User.findOne({ email });
    studentUsn = user?.usn || "N/A";
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: `"Prarambha Path" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Scholar Activation - Prarambha Path",
      html: `
        <div style="font-family: sans-serif; padding: 30px; background-color: #E8F6FA; border-radius: 20px; border: 1px solid #2FA8CC;">
          <h1 style="color: #1F4E79; text-align: center;">Welcome Scholar</h1>
          <div style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <p style="color: #2FA8CC; font-weight: bold; margin: 0; text-transform: uppercase; font-size: 12px;">Your Student ID (USN):</p>
            <h2 style="color: #1F4E79; margin: 5px 0;">${studentUsn}</h2>
          </div>
          <div style="text-align: center;">
            <p style="color: #1F4E79; font-weight: bold;">Your activation code is:</p>
            <h1 style="color: #FF6B00; font-size: 42px; letter-spacing: 10px; margin: 10px 0;">${otp}</h1>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to send email." };
  }
}

/**
 * Action: Register Student (PPG Pattern)
 */
export async function registerStudentAction(formData: FormData) {
  try {
    await connectDB();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const studentClass = formData.get("class") as string; // "09" or "10"
    
    const prefix = "PPG26S"; 

    // 1. Check if Email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return { error: "This email is already registered." };

    // 2. FIND THE LATEST USN FOR THIS CLASS
    // We search for the USN that has the highest sequence number
    const lastStudent = await User.findOne({ 
      usn: { $regex: `^${prefix}${studentClass}-` } 
    }).sort({ usn: -1 }); // Sort descending to get the highest number

    let nextSequence = 1;

    if (lastStudent && lastStudent.usn) {
      // Extract the number after the hyphen (e.g., "PPG26S10-005" -> "005")
      const lastSequenceText = lastStudent.usn.split("-")[1];
      nextSequence = parseInt(lastSequenceText) + 1;
    }

    const sequence = nextSequence.toString().padStart(3, '0');
    const generatedUsn = `${prefix}${studentClass}-${sequence}`;

    console.log("Creating New Student with USN:", generatedUsn);

    // 3. Create the Record
    const newUser = new User({
      userId: generatedUsn, // Use USN as the unique identifier
      name,
      email,
      role: "student",
      usn: generatedUsn,
      isVerified: false,
    });

    await newUser.save();
    
    // 4. Send the OTP email
    return await sendOtpAction(email, generatedUsn); 
  } catch (error: any) {
    console.error("Registration Error Detail:", error.message);
    return { error: "Internal Server Error. Please try again." };
  }
}
/**
 * Action: Complete Setup (Saves Password & Sends Welcome Email)
 */
export async function completeSetupAction(formData: FormData) {
  try {
    await connectDB();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, isVerified: true },
      { new: true }
    );

    if (!user) return { error: "Activation failed." };

    // Send the final Welcome Email with USN and Password
    await sendWelcomeEmail(email, user.usn, password);

    return { success: true };
  } catch (error) {
    return { error: "Database error occurred." };
  }
}