import { NextResponse } from "next/server"
import { Resend } from "resend"

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      createdAt,
    } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and message are required.",
        },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const senderEmail = process.env.SENDER_EMAIL
    const recipientEmail = process.env.RECIPIENT_EMAIL

    if (!apiKey || !senderEmail || !recipientEmail) {
      console.error("Email service environment variables are missing.")

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const submittedAt = createdAt || new Date().toISOString()

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111">
        <h2>New Contact Form Submission - PPES Website</h2>

        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "N/A")}</p>

        <p>
          <strong>Message:</strong><br/>
          ${escapeHtml(message).replace(/\n/g, "<br/>")}
        </p>

        <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
      </div>
    `

    const { error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      replyTo: email,
      subject: "New Contact Form Submission - PPES Website",
      html,
    })

    if (error) {
      console.error("Resend error:", error)

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email sent",
    })
  } catch (error) {
    console.error("Contact API error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process contact request.",
      },
      { status: 500 }
    )
  }
}
