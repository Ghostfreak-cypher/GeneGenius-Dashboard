import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { signupSchema } from '@/lib/validations';
import { sendAdminApprovalRequest, sendUserPendingConfirmation } from '@/lib/nodemailer';
import { findAdminUsers, getAdminEmail } from '@/utils/admin';
import crypto from 'crypto';

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

    const { email, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate approval token (not verification token yet)
    const approvalToken = crypto.randomBytes(32).toString('hex');

    // Create user with pending approval
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || '',
      role: 'user',
      isApproved: false,
      isVerified: false,
      approvalToken,
    });

    // Find admin users and send approval request
    try {
      const adminUsers = await findAdminUsers();
      const adminEmails = adminUsers.map(admin => admin.email);
      
      // Send approval request to all admins
      if (adminEmails.length > 0) {
        await sendAdminApprovalRequest(
          {
            name: user.name,
            email: user.email,
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
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          approvalToken,
          [fallbackEmail]
        );
      }

      // Send pending confirmation to user
      await sendUserPendingConfirmation(email, name || '');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the registration if email fails
    }

    // Return success response (exclude password)
    return NextResponse.json(
      {
        message: 'Registration successful! Your account request has been sent for administrator approval. You will receive an email once your account has been reviewed.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isApproved: user.isApproved,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more detailed error information in development mode
    const isDevelopment = true; // Hardcoded to development mode
    const errorMessage = isDevelopment
      ? error.message || 'An error occurred during registration'
      : 'An error occurred during registration';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: error.stack })
      },
      { status: 500 }
    );
  }
}

