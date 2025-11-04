"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  error?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Store email separately for easy access
        if (data.user?.email) {
          localStorage.setItem("userEmail", data.user.email);
        }
      }

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
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
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-purple-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-black dark:text-white mb-2"
        >
          Password
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
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-purple-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="••••••••"
        />
        <div className="mt-2 flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200/70 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
          <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 -z-10 bg-linear-to-r from-zinc-500 via-zinc-800 to-zinc-500 opacity-0 transition group-hover:opacity-100" />
        {loading ? "Logging in…" : "Log In"}
      </button>

      <div className="text-center">
        <Link
          href="/signup"
          className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          Don&apos;t have an account? <span className="underline">Sign up</span>
        </Link>
      </div>
    </form>
  );
}
