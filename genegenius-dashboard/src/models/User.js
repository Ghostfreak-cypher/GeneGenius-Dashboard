import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Organization Information
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    organizationType: {
      type: String,
      enum: [
        "Research Institute",
        "Hospital",
        "Pharmaceutical Company",
        "Biotech Startup",
        "University",
        "Government Lab",
        "Private Lab",
        "Other",
      ],
      required: [true, "Organization type is required"],
    },
    registrationNumber: {
      type: String,
      trim: true,
    },

    // Contact Person Details
    contactPersonName: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Email & Authentication
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Address Information
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State/Province is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Postal/ZIP code is required"],
        trim: true,
      },
    },

    // Research/Business Information
    researchFocus: {
      type: [String],
      default: [],
    },
    numberOfEmployees: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    website: {
      type: String,
      trim: true,
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Approval & Verification Status
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    approvalToken: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // OTP-based email verification fields
    emailVerificationOTPHash: {
      type: String,
    },
    emailVerificationOTPExpiresAt: {
      type: Date,
    },
    emailVerificationOTPAttempts: {
      type: Number,
      default: 0,
    },

    // Subscription & Usage
    subscriptionTier: {
      type: String,
      enum: ["trial", "basic", "professional", "enterprise"],
      default: "trial",
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
