"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "signin" | "signup";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError);
        } else {
          onClose();
        }
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError);
        } else {
          setSuccessMessage("Account created — check your email to confirm, then sign in.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) onClose();
  }

  function switchMode(): void {
    setMode((current) => (current === "signin" ? "signup" : "signin"));
    setError(null);
    setSuccessMessage(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="auth-modal-title" className="text-lg font-semibold text-slate-900">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <button
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            aria-label="Close auth modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {successMessage && (
            <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isSubmitting ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-amber-600 hover:underline"
            onClick={switchMode}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
