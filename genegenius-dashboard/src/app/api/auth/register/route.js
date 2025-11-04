import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";
import {
  sendAdminApprovalRequest,
  sendUserPendingConfirmation,
  sendSignupOTP,
} from "@/lib/nodemailer";
import { findAdminUsers } from "@/utils/admin";
import crypto from "crypto";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      organizationName,
      organizationType,
      registrationNumber,
      contactPersonName,
      designation,
      phoneNumber,
      address,
      numberOfEmployees,
      website,
    } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Organization with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate approval token (not verification token yet)
    const approvalToken = crypto.randomBytes(32).toString("hex");

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create user with organization information
    const user = await User.create({
      organizationName,
      organizationType,
      registrationNumber,
      contactPersonName,
      designation,
      phoneNumber,
      email,
      password: hashedPassword,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      },
      numberOfEmployees,
      website,
      role: "user",
      isApproved: false,
      isVerified: false,
      approvalToken,
      emailVerificationOTPHash: otpHash,
      emailVerificationOTPExpiresAt: otpExpiresAt,
      emailVerificationOTPAttempts: 0,
    });

    // Find admin users and send approval request
    try {
      const adminUsers = await findAdminUsers();
      const adminEmails = adminUsers.map((admin) => admin.email);

      // Send approval request to all admins
      if (adminEmails.length > 0) {
        await sendAdminApprovalRequest(
          {
            name: user.contactPersonName,
            organizationName: user.organizationName,
            organizationType: user.organizationType,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: `${user.address.city}, ${user.address.state}, ${user.address.country}`,
            createdAt: user.createdAt,
          },
          approvalToken,
          adminEmails
        );
      } else {
        // Fallback: use ADMIN_EMAIL env var or sender email
        const fallbackEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        await sendAdminApprovalRequest(
          {
            name: user.contactPersonName,
            organizationName: user.organizationName,
            organizationType: user.organizationType,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: `${user.address.city}, ${user.address.state}, ${user.address.country}`,
            createdAt: user.createdAt,
          },
          approvalToken,
          [fallbackEmail]
        );
      }

      // Send OTP to user for email verification
      await sendSignupOTP(email, contactPersonName, otp);
      // Also send pending confirmation informational email (optional)
      await sendUserPendingConfirmation(email, contactPersonName);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the registration if email fails
    }

    // Return success response (exclude password)
    return NextResponse.json(
      {
        message:
          "Registration successful! Your organization account request has been sent for administrator approval. Please check your email for the verification code.",
        user: {
          id: user._id,
          email: user.email,
          organizationName: user.organizationName,
          contactPersonName: user.contactPersonName,
          isApproved: user.isApproved,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Provide more detailed error information in development mode
    const isDevelopment = true; // Hardcoded to development mode
    const errorMessage = isDevelopment
      ? error.message || "An error occurred during registration"
      : "An error occurred during registration";

    return NextResponse.json(
      {
        error: errorMessage,
        ...(isDevelopment && { details: error.stack }),
      },
      { status: 500 }
    );
  }
}
