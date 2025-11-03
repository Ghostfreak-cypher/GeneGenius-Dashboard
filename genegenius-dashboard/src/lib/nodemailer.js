import nodemailer from 'nodemailer';

// Hardcoded email configuration
const APP_URL = 'http://localhost:3000';
const EMAIL_USER = 'alene.vandervort55@ethereal.email';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: 'dQ48eVeFUyX7xbuub2',
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${APP_URL}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Email Verification</h1>
        <p style="color: #000000; font-size: 16px;">Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #808080; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #000000; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #808080; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
      </div>
    `,
    text: `Thank you for signing up! Please verify your email address by visiting: ${verificationUrl}`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Password Reset Request</h1>
        <p style="color: #000000; font-size: 16px;">You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #808080; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #000000; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #808080; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `You requested to reset your password. Visit: ${resetUrl}`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendAdminApprovalRequest(userDetails, approvalToken, adminEmails = []) {
  const approveUrl = `${APP_URL}/api/auth/approve/${approvalToken}`;
  const rejectUrl = `${APP_URL}/api/auth/approve/reject/${approvalToken}`;

  // Determine recipients: adminEmails array, or fallback to sender email
  let recipients = adminEmails.length > 0 
    ? adminEmails.join(', ')
    : EMAIL_USER;

  const mailOptions = {
    from: EMAIL_USER,
    to: recipients,
    subject: 'New User Registration Request - Approval Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">New User Registration Request</h1>
        <p style="color: #000000; font-size: 16px;">A new user has requested to register on the platform:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border: 1px solid #000000;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${userDetails.name || 'Not provided'}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${userDetails.email}</p>
          <p style="margin: 10px 0;"><strong>Registration Date:</strong> ${new Date(userDetails.createdAt).toLocaleString()}</p>
        </div>
        <p style="color: #000000; font-size: 16px;">Please review and take action:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${approveUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-right: 10px;">Approve User</a>
          <a href="${rejectUrl}" style="background-color: #ffffff; color: #000000; padding: 12px 30px; text-decoration: none; border: 2px solid #000000; border-radius: 4px; display: inline-block; font-weight: bold;">Reject User</a>
        </div>
        <p style="color: #808080; font-size: 12px; margin-top: 30px;">Or copy and paste these links:</p>
        <p style="color: #000000; font-size: 12px; word-break: break-all;">Approve: ${approveUrl}</p>
        <p style="color: #000000; font-size: 12px; word-break: break-all;">Reject: ${rejectUrl}</p>
      </div>
    `,
    text: `New user registration request:\n\nName: ${userDetails.name || 'Not provided'}\nEmail: ${userDetails.email}\nRegistration Date: ${new Date(userDetails.createdAt).toLocaleString()}\n\nApprove: ${approveUrl}\nReject: ${rejectUrl}`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendUserPendingConfirmation(email, name) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Registration Request Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Registration Request Received</h1>
        <p style="color: #000000; font-size: 16px;">Hello ${name || 'there'},</p>
        <p style="color: #000000; font-size: 16px;">Thank you for registering! Your account request has been received and is pending administrator approval.</p>
        <p style="color: #000000; font-size: 16px;">You will receive an email notification once your account has been reviewed and approved by an administrator.</p>
        <p style="color: #808080; font-size: 14px; margin-top: 30px;">If you have any questions, please contact support.</p>
      </div>
    `,
    text: `Hello ${name || 'there'},\n\nThank you for registering! Your account request has been received and is pending administrator approval. You will receive an email notification once your account has been reviewed and approved.`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendUserApprovalNotification(email, name, verificationToken) {
  const verificationUrl = `${APP_URL}/api/auth/verify?token=${verificationToken}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Account Approved - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Account Approved!</h1>
        <p style="color: #000000; font-size: 16px;">Hello ${name || 'there'},</p>
        <p style="color: #000000; font-size: 16px;">Great news! Your account has been approved by an administrator.</p>
        <p style="color: #000000; font-size: 16px;">To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #808080; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #000000; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #808080; font-size: 12px; margin-top: 30px;">After verification, you'll be able to log in to your account.</p>
      </div>
    `,
    text: `Hello ${name || 'there'},\n\nGreat news! Your account has been approved. Please verify your email address by visiting: ${verificationUrl}`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendUserRejectionNotification(email, name) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Registration Request Decision',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Registration Request Decision</h1>
        <p style="color: #000000; font-size: 16px;">Hello ${name || 'there'},</p>
        <p style="color: #000000; font-size: 16px;">We regret to inform you that your registration request has been reviewed and could not be approved at this time.</p>
        <p style="color: #808080; font-size: 14px; margin-top: 30px;">If you believe this is an error or have questions, please contact our support team.</p>
      </div>
    `,
    text: `Hello ${name || 'there'},\n\nWe regret to inform you that your registration request has been reviewed and could not be approved at this time. If you have questions, please contact support.`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendSignupOTP(email, name, otp) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your GeneGenius verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000; background-color: #ffffff;">
        <h1 style="color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px;">Verify your email</h1>
        <p style="color: #000000; font-size: 16px;">Hello ${name || 'there'},</p>
        <p style="color: #000000; font-size: 16px;">Use the following One-Time Passcode (OTP) to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; letter-spacing: 6px; font-size: 28px; font-weight: 700; background:#f5f5f5; border:1px solid #000000; padding: 14px 24px;">${otp}</div>
        </div>
        <p style="color: #808080; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
    text: `Hello ${name || 'there'}, your verification code is: ${otp}. It expires in 10 minutes.`,
  };

  return await transporter.sendMail(mailOptions);
}

