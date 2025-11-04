import { z } from "zod";

export const signupSchema = z
  .object({
    // Organization Information
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters"),
    organizationType: z.enum([
      "Research Institute",
      "Hospital",
      "Pharmaceutical Company",
      "Biotech Startup",
      "University",
      "Government Lab",
      "Private Lab",
      "Other",
    ]),
    registrationNumber: z.string().optional(),

    // Contact Person Details
    contactPersonName: z
      .string()
      .min(2, "Contact person name must be at least 2 characters"),
    designation: z.string().optional(),
    phoneNumber: z.string().min(10, "Please provide a valid phone number"),

    // Email & Password
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),

    // Address Information
    address: z.object({
      street: z.string().min(5, "Street address is required"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State/Province is required"),
      country: z.string().min(2, "Country is required"),
      postalCode: z.string().min(3, "Postal/ZIP code is required"),
    }),

    // Additional Information (optional)
    numberOfEmployees: z
      .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
      .optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const resendOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPData = z.infer<typeof verifyOTPSchema>;
export type ResendOTPData = z.infer<typeof resendOTPSchema>;
