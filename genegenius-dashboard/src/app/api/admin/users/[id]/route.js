import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { isAdmin } from '@/utils/admin';

// GET: Get specific user details
export async function GET(request, { params }) {
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

    const { id } = params;
    const user = await User.findById(id).select('-password -emailVerificationToken -resetPasswordToken -approvalToken');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    
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

// PATCH: Update user
export async function PATCH(request, { params }) {
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

    const { id } = params;
    const body = await request.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (body.role !== undefined) user.role = body.role;
    if (body.isApproved !== undefined) user.isApproved = body.isApproved;
    if (body.isVerified !== undefined) user.isVerified = body.isVerified;
    if (body.name !== undefined) user.name = body.name;

    await user.save();

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isApproved: user.isApproved,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    
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


