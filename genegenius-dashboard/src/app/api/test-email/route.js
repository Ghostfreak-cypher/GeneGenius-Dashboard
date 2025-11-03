import { sendSignupOTP } from "@/lib/nodemailer";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "test@example.com";

    console.log(`🧪 Testing email to: ${email}`);

    const result = await sendSignupOTP(email, "Test User", "123456");

    return Response.json({
      success: true,
      message: "✅ Email sent successfully!",
      messageId: result.messageId,
      previewUrl: nodemailer.getTestMessageUrl(result),
      instructions:
        "For Ethereal emails, visit: https://ethereal.email/messages and login with your Ethereal credentials to view the email.",
    });
  } catch (error) {
    console.error("❌ Email test failed:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
        troubleshooting: [
          "Check your .env.local file has correct EMAIL_USER and EMAIL_PASSWORD",
          "Verify EMAIL_SERVICE and SMTP_HOST are set correctly",
          "Check your internet connection",
          "Restart your development server after changing .env.local",
        ],
      },
      { status: 500 }
    );
  }
}
