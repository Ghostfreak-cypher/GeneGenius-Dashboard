import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { isAdmin } from '@/utils/admin';
import { sendUserApprovalNotification, sendUserRejectionNotification } from '@/lib/nodemailer';
import crypto from 'crypto';

// GET: List all users with pending approval
export async function GET(request) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !(await isAdmin(decoded.userId))) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending'; // pending, approved, all

    let query = {};
    if (status === 'pending') {
      query = { isApproved: false };
    } else if (status === 'approved') {
      query = { isApproved: true };
    }

    const users = await User.find(query)
      .select('-password -emailVerificationToken -resetPasswordToken -approvalToken')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    
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

// POST: Approve or reject user
export async function POST(request) {
  try {
    await connectDB();

    // Authenticate admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !(await isAdmin(decoded.userId))) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request. userId and action (approve/reject) required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      if (user.isApproved) {
        return NextResponse.json(
          { message: 'User already approved' },
          { status: 200 }
        );
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Approve user
      user.isApproved = true;
      user.approvedBy = decoded.userId;
      user.approvedAt = new Date();
      user.emailVerificationToken = emailVerificationToken;
      user.approvalToken = undefined;
      await user.save();

      // Send approval notification with verification link
      try {
        await sendUserApprovalNotification(
          user.email,
          user.name || '',
          emailVerificationToken
        );
      } catch (emailError) {
        console.error('Error sending approval notification:', emailError);
      }

      return NextResponse.json(
        { message: 'User approved successfully', user: { id: user._id, email: user.email } },
        { status: 200 }
      );
    } else if (action === 'reject') {
      // Send rejection email
      try {
        await sendUserRejectionNotification(user.email, user.name || '');
      } catch (emailError) {
        console.error('Error sending rejection notification:', emailError);
      }

      // Delete user account
      await User.findByIdAndDelete(userId);

      return NextResponse.json(
        { message: 'User rejected and removed successfully' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error processing approval/rejection:', error);
    
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


