import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { verifyOTPSchema } from '@/lib/validations';

const MAX_ATTEMPTS = 5;

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = verifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
    }

    // Check attempts
    if ((user.emailVerificationOTPAttempts || 0) >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many attempts. Please request a new code.' }, { status: 429 });
    }

    // Check expiry
    if (!user.emailVerificationOTPExpiresAt || user.emailVerificationOTPExpiresAt < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new code.' }, { status: 400 });
    }

    // Compare hash
    const providedHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (providedHash !== user.emailVerificationOTPHash) {
      user.emailVerificationOTPAttempts = (user.emailVerificationOTPAttempts || 0) + 1;
      await user.save();
      return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 });
    }

    // Success: verify and clear OTP fields
    user.isVerified = true;
    user.emailVerificationOTPHash = undefined;
    user.emailVerificationOTPExpiresAt = undefined;
    user.emailVerificationOTPAttempts = 0;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    const isDevelopment = true;
    return NextResponse.json({ error: isDevelopment ? (error.message || 'Error verifying code') : 'Error verifying code' }, { status: 500 });
  }
}

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

