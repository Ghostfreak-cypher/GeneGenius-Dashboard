"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();

  // Organization Information
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationType, setOrganizationType] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");

  // Contact Person Details
  const [contactPersonName, setContactPersonName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Email & Password
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Address Information
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  // Additional Information
  const [numberOfEmployees, setNumberOfEmployees] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const organizationTypes = [
    "Research Institute",
    "Hospital",
    "Pharmaceutical Company",
    "Biotech Startup",
    "University",
    "Government Lab",
    "Private Lab",
    "Other",
  ];

  const employeeSizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  const validateStep = () => {
    setError("");

    if (currentStep === 1) {
      if (!organizationName.trim()) {
        setError("Organization name is required");
        return false;
      }
      if (!organizationType) {
        setError("Please select an organization type");
        return false;
      }
      if (!contactPersonName.trim()) {
        setError("Contact person name is required");
        return false;
      }
      if (!phoneNumber.trim()) {
        setError("Phone number is required");
        return false;
      }
      return true;
    } else if (currentStep === 2) {
      if (
        !street.trim() ||
        !city.trim() ||
        !state.trim() ||
        !country.trim() ||
        !postalCode.trim()
      ) {
        setError("All address fields are required");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    if (!organizationName.trim()) {
      setError("Organization name is required");
      return;
    }
    if (!organizationType) {
      setError("Please select an organization type");
      return;
    }
    if (!contactPersonName.trim()) {
      setError("Contact person name is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim() ||
      !postalCode.trim()
    ) {
      setError("All address fields are required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName,
          organizationType,
          registrationNumber: registrationNumber || undefined,
          contactPersonName,
          designation: designation || undefined,
          phoneNumber,
          email,
          password,
          confirmPassword,
          address: {
            street,
            city,
            state,
            country,
            postalCode,
          },
          numberOfEmployees: numberOfEmployees || undefined,
          website: website || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess(
        data.message ||
          "Registration successful! Enter the code sent to your email."
      );
      setLoading(false);

      const emailForRedirect = email;

      // Redirect to verify page with email prefilled
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(emailForRedirect)}`);
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "bg-white/10 text-gray-500 border-2 border-white/20"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`text-xs mt-2 font-medium transition-colors ${
                    currentStep >= step ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  {step === 1
                    ? "Organization"
                    : step === 2
                    ? "Address"
                    : "Account"}
                </span>
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-all duration-300 rounded ${
                    currentStep > step ? "bg-blue-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Step 1: Organization Information - Horizontal Layout */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Organization Details
            </h3>

            {/* Row 1: Organization Name & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Organization Name *
                </label>
                <input
                  id="organizationName"
                  type="text"
                  value={organizationName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setOrganizationName(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="GeneGenius Labs Inc."
                />
              </div>

              <div>
                <label
                  htmlFor="organizationType"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Organization Type *
                </label>
                <select
                  id="organizationType"
                  value={organizationType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setOrganizationType(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 disabled:opacity-60"
                >
                  <option value="" className="bg-gray-900">
                    Select type
                  </option>
                  {organizationTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Contact Person & Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contactPersonName"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Contact Person *
                </label>
                <input
                  id="contactPersonName"
                  type="text"
                  value={contactPersonName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setContactPersonName(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label
                  htmlFor="designation"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Designation
                </label>
                <input
                  id="designation"
                  type="text"
                  value={designation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDesignation(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="Chief Scientist"
                />
              </div>
            </div>

            {/* Row 3: Phone & Registration Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPhoneNumber(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Registration Number
                </label>
                <input
                  id="registrationNumber"
                  type="text"
                  value={registrationNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRegistrationNumber(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="REG123456"
                />
              </div>
            </div>

            {/* Row 4: Company Size & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="numberOfEmployees"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Company Size
                </label>
                <select
                  id="numberOfEmployees"
                  value={numberOfEmployees}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setNumberOfEmployees(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 disabled:opacity-60"
                >
                  <option value="" className="bg-gray-900">
                    Select size
                  </option>
                  {employeeSizes.map((size) => (
                    <option key={size} value={size} className="bg-gray-900">
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setWebsite(e.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Information - Horizontal Layout */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Address Details
            </h3>

            {/* Row 1: Street Address (Full Width) */}
            <div>
              <label
                htmlFor="street"
                className="block text-xs font-medium text-gray-300 mb-1.5"
              >
                Street Address *
              </label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStreet(e.target.value)
                }
                required
                disabled={loading}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                placeholder="123 Main Street, Suite 100"
              />
            </div>

            {/* Row 2: City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCity(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  State/Province *
                </label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setState(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="California"
                />
              </div>
            </div>

            {/* Row 3: Country & Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Country *
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCountry(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="United States"
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Postal/ZIP Code *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPostalCode(e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="94103"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Account Information - Horizontal Layout */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Account Credentials
            </h3>

            {/* Email (Full Width) */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-300 mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                disabled={loading}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                placeholder="contact@genegenius.com"
              />
            </div>

            {/* Row: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  disabled={loading}
                  minLength={6}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Min. 6 characters</p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-300 mb-1.5"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  disabled={loading}
                  minLength={6}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-blue-500/70 placeholder:text-gray-500 disabled:opacity-60"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-400">
            <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-white/20"
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="ml-auto rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 outline-none transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 outline-none transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-500/70 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Creating...
                </div>
              ) : (
                "Register Organization"
              )}
            </button>
          )}
        </div>

        {/* Login Link */}
        {currentStep === 1 && (
          <div className="text-center text-sm text-gray-400 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Sign in here
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
