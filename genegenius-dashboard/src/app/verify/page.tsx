"use client";

import { useEffect, useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DNAHelix from "@/components/DNAHelix";

interface VerifyResponse {
  error?: string;
  message?: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const qpEmail = searchParams.get("email");
    if (qpEmail) setEmail(qpEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data: VerifyResponse = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }
      setSuccess("Email verified! You can log in after admin approval.");
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
      console.error("Verification error:", err);
    }
  };

  const handleResend = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: VerifyResponse = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend code");
        setLoading(false);
        return;
      }
      setSuccess("A new code has been sent to your email.");
      setLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
      console.error("Resend error:", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black dark:bg-black">
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-sm sm:max-w-md">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[150vw] lg:w-screen h-screen -z-10">
            <DNAHelix numPairs={100} spacing={20} showBackground={false} />
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6 text-center">
              <h1 className="text-2xl font-semibold text-white">
                Verify your email
              </h1>
              <p className="mt-1 text-xs text-gray-400">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div className="max-w-md mx-auto w-full">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black dark:text-white mb-2"
                  >
                    Email
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
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-black dark:text-white mb-2"
                  >
                    6-digit code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60 tracking-widest"
                    placeholder="••••••"
                    aria-describedby="otp-help"
                  />
                  <p
                    id="otp-help"
                    className="mt-1 text-xs text-gray-600 dark:text-gray-400"
                  >
                    Enter the 6-digit code sent to your email
                  </p>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading || !email}
                      className="text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition disabled:opacity-60"
                    >
                      Resend code
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 rounded-lg border border-red-200/70 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400"
                    aria-live="polite"
                  >
                    <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    className="flex items-start gap-2 rounded-lg border border-green-200/70 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400"
                    aria-live="polite"
                  >
                    <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 -z-10 bg-linear-to-r from-zinc-500 via-zinc-800 to-zinc-500 opacity-0 transition group-hover:opacity-100" />
                  {loading ? "Verifying…" : "Verify email"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
