import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { resendOTPSchema } from '@/lib/validations';
import { sendSignupOTP } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = resendOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
    }

    // Simple cooldown: block resend if previous code was sent less than ~60s ago
    if (
      user.emailVerificationOTPExpiresAt &&
      user.emailVerificationOTPExpiresAt.getTime() - Date.now() > 9 * 60 * 1000
    ) {
      return NextResponse.json({ error: 'Please wait before requesting a new code.' }, { status: 429 });
    }

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationOTPHash = otpHash;
    user.emailVerificationOTPExpiresAt = otpExpiresAt;
    user.emailVerificationOTPAttempts = 0;
    await user.save();

    await sendSignupOTP(user.email, user.name || '', otp);

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Resend OTP error:', error);
    const isDevelopment = true;
    return NextResponse.json({ error: isDevelopment ? (error.message || 'Error resending code') : 'Error resending code' }, { status: 500 });
  }
}


