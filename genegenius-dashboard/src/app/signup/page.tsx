"use client";

import SignupForm from "@/components/SignupForm";
import DNAHelix from "@/components/DNAHelix";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black dark:bg-black">
      {/* Signup Form Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-sm sm:max-w-md">
          {/* DNA Helix Background - Behind form with full height */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[150vw] lg:w-screen h-screen -z-10">
            <DNAHelix numPairs={100} spacing={20} showBackground={false} />
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Create account
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
                Sign up to get started
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
