import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendUserRejectionNotification } from '@/lib/nodemailer';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { token } = params;

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=Invalid rejection token', request.url)
      );
    }

    // Find user by approval token
    const user = await User.findOne({ approvalToken: token });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=Invalid or expired token', request.url)
      );
    }

    // Send rejection email to user
    try {
      await sendUserRejectionNotification(user.email, user.name || '');
    } catch (emailError) {
      console.error('Error sending rejection notification:', emailError);
    }

    // Delete the user account
    await User.findByIdAndDelete(user._id);

    return NextResponse.redirect(
      new URL('/login?message=User request has been rejected', request.url)
    );
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.redirect(
      new URL('/login?error=Rejection failed', request.url)
    );
  }
}


