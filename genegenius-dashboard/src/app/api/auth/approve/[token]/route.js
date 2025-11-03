import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendUserApprovalNotification } from '@/lib/nodemailer';
import crypto from 'crypto';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { token } = params;

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=Invalid approval token', request.url)
      );
    }

    // Find user by approval token
    const user = await User.findOne({ approvalToken: token });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=Invalid or expired approval token', request.url)
      );
    }

    // Check if already approved
    if (user.isApproved) {
      return NextResponse.redirect(
        new URL('/login?message=User already approved', request.url)
      );
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Approve user and generate verification token
    user.isApproved = true;
    user.approvedAt = new Date();
    user.emailVerificationToken = emailVerificationToken;
    user.approvalToken = undefined; // Clear approval token
    await user.save();

    // Send verification email to user
    try {
      await sendUserApprovalNotification(
        user.email,
        user.name || '',
        emailVerificationToken
      );
    } catch (emailError) {
      console.error('Error sending approval notification:', emailError);
    }

    return NextResponse.redirect(
      new URL('/login?message=User approved successfully', request.url)
    );
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.redirect(
      new URL('/login?error=Approval failed', request.url)
    );
  }
}


