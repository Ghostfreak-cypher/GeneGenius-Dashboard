// Test script to verify email configuration
// Run with: node test-email.js

import { sendSignupOTP } from "./src/lib/nodemailer.js";

console.log("🧪 Testing email configuration...\n");

const testEmail = process.argv[2] || "test@example.com";
const testName = "Test User";
const testOTP = "123456";

console.log(`📧 Sending test email to: ${testEmail}`);
console.log("⏳ Please wait...\n");

sendSignupOTP(testEmail, testName, testOTP)
  .then((info) => {
    console.log("✅ SUCCESS! Email sent successfully!");
    console.log("📨 Message ID:", info.messageId);
    console.log("\n🎉 Your email configuration is working correctly!");
    console.log(`📬 Check your inbox at: ${testEmail}`);
    console.log("💡 Don't forget to check your spam folder!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ ERROR: Failed to send email");
    console.error("📋 Error details:", error.message);
    console.error("\n🔧 Troubleshooting tips:");
    console.error(
      "   1. Check your .env.local file has correct EMAIL_USER and EMAIL_PASSWORD"
    );
    console.error(
      "   2. If using Gmail, make sure you're using an App Password"
    );
    console.error("   3. Check that EMAIL_SERVICE is set correctly");
    console.error("   4. Verify your internet connection");
    console.error(
      "   5. Check the EMAIL_SETUP.md file for detailed instructions\n"
    );
    process.exit(1);
  });
