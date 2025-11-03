'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess(data.message || 'Registration successful! Please check your email to verify your account.');
      setLoading(false);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Optionally redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white mb-2">
          Name (optional)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-black dark:text-white mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="••••••••"
          minLength={6}
        />
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Must be at least 6 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-black dark:text-white mb-2">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 px-4 py-3 text-black dark:text-white shadow-sm outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-sky-500/70 dark:focus:ring-sky-400/70 placeholder:text-gray-400 disabled:opacity-60"
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200/70 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
          <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-200/70 dark:border-green-800/50 bg-green-50/80 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400">
          <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-500 via-zinc-800 to-zinc-500 opacity-0 transition group-hover:opacity-100" />
        {loading ? 'Signing up…' : 'Create account'}
      </button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          Already have an account? <span className="underline">Log in</span>
        </Link>
      </div>
    </form>
  );
}

