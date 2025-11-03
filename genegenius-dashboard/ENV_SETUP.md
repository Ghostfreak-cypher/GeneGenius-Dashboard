# Environment Variables Setup Guide

Create a `.env.local` file in the `genegenius-dashboard` directory with the following variables:

## Required Environment Variables

```env
# MongoDB Configuration
# Local MongoDB: mongodb://localhost:27017/genegenius-dashboard
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_URI=mongodb://localhost:27017/genegenius-dashboard

# JWT Secret Key (Change this to a secure random string in production)
# Generate with: openssl rand -base64 32
JWT_SECRET=your-secret-key-change-this-in-production-min-32-characters-long

# Email Configuration (Nodemailer)
# For Gmail, you need to generate an App Password: https://support.google.com/accounts/answer/185833
# Gmail SMTP: smtp.gmail.com
# Outlook SMTP: smtp-mail.outlook.com
# Custom SMTP: your-smtp-server.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-or-email-password

# Application URL (used in email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Email (Optional)
# If not set, will use EMAIL_USER as fallback or find admin users from database
# ADMIN_EMAIL=admin@example.com
```

## Setup Instructions

1. **Create the file**: In the `genegenius-dashboard` directory, create a file named `.env.local`

2. **MongoDB URI**: 
   - For local MongoDB: `mongodb://localhost:27017/genegenius-dashboard`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

3. **JWT Secret**: 
   - Must be at least 32 characters long
   - Generate securely with: `openssl rand -base64 32`
   - Keep this secret and never commit it to version control

4. **Email Configuration**:
   - **Gmail**: Use an App Password (not your regular password)
     - Enable 2-Step Verification
     - Generate App Password: https://support.google.com/accounts/answer/185833
   - **Outlook/Hotmail**: Use your regular password or app-specific password
   - **Custom SMTP**: Use your email provider's SMTP settings

5. **Application URL**: 
   - Development: `http://localhost:3000`
   - Production: Your production domain URL

6. **Admin Email** (Optional):
   - If set, approval requests will be sent to this email
   - If not set, the system will:
     - First try to find admin/master users in the database
     - Fallback to EMAIL_USER

## Example `.env.local` File

```env
MONGODB_URI=mongodb://localhost:27017/genegenius-dashboard
JWT_SECRET=my-super-secret-jwt-key-minimum-32-characters-long-please
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-char-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
```

## Notes

- The `.env.local` file is automatically ignored by git (see `.gitignore`)
- Never commit actual credentials to version control
- For production, set these variables in your hosting platform's environment settings
- Restart your development server after creating or modifying `.env.local`


