"use client";

import SignupForm from "@/components/SignupForm";
import DNAHelix from "@/components/DNAHelix";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black dark:bg-black">
      {/* DNA Helix Background */}
      <div className="absolute inset-0 w-full h-full">
        <DNAHelix numPairs={100} spacing={20} showBackground={false} />
      </div>

      {/* Signup Form Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-3xl">
          <div className="rounded-2xl border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl p-6 lg:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Register Your Organization
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Join the GeneGenius platform to access cutting-edge genomics
                tools
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
