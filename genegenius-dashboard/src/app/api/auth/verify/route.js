import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=Invalid verification token', request.url));
    }

    // Find user by verification token
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=Invalid or expired verification token', request.url));
    }

    // Check if user is approved first
    if (!user.isApproved) {
      return NextResponse.redirect(new URL('/login?error=Your account must be approved by an administrator before you can verify your email', request.url));
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/login?error=Verification failed', request.url));
  }
}

