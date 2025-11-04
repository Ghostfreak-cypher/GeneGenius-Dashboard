"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import DNAHelix from "@/components/DNAHelix";

function LoginContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      setMessage("Email verified successfully! You can now log in.");
      setMessageType("success");
    } else if (error) {
      setMessage(decodeURIComponent(error));
      setMessageType("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {message && (
        <div
          className={`p-4 mb-6 border ${
            messageType === "success"
              ? "bg-white/10 border-white/30 text-white"
              : "bg-black/10 border-black/30 text-black dark:bg-white/10 dark:border-white/30 dark:text-white"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-black border border-black dark:border-white p-8">
        <LoginForm />
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black dark:bg-black">
      {/* Login Form Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-sm sm:max-w-md">
          {/* DNA Helix Background - Behind form with full height */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[150vw] lg:w-screen h-screen -z-10">
            <DNAHelix numPairs={100} spacing={20} showBackground={false} />
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                GeneGenius
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
                For Researchers and Scientists Only
              </p>
            </div>
            <Suspense
              fallback={
                <div className="text-center text-white text-sm">Loading...</div>
              }
            >
              <LoginContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
