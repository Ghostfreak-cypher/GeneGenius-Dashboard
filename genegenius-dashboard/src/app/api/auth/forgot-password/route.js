import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { forgotPasswordSchema } from '@/lib/validations';
import { sendPasswordResetEmail } from '@/lib/nodemailer';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user
    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token with expiration (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Provide more detailed error information in development mode
    const isDevelopment = true; // Hardcoded to development mode
    const errorMessage = isDevelopment
      ? error.message || 'An error occurred'
      : 'An error occurred';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: error.stack })
      },
      { status: 500 }
    );
  }
}

