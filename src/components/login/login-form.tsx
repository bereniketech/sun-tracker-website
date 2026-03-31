"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

type AuthMode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const { user, isLoading, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [isLoading, router, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const { error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError);
          return;
        }

        router.push("/");
        return;
      }

      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError);
        return;
      }

      setSuccessMessage("Account created — check your email to confirm, then sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleToggleMode(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setMode((currentMode) => (currentMode === "signin" ? "signup" : "signin"));
    setError(null);
    setSuccessMessage(null);
  }

  function handleContinueAsGuest(): void {
    router.push("/");
  }

  return (
    <section className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-8 shadow-[0_8px_48px_rgba(11,28,48,0.08)]">
      <div className="mb-7 flex flex-col items-center text-center">
        <Sun className="mb-3 h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="font-headline text-2xl font-bold text-on-surface">Sun Tracker</h1>
        <p className="mt-2 text-xs font-medium tracking-widest text-secondary uppercase">
          Precision Solar Tracking
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-medium tracking-widest text-secondary uppercase"
          >
            Observer ID / Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-secondary/70 border-b border-transparent focus:border-b-2 focus:border-primary focus:outline-none"
            placeholder="you@observatory.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-xs font-medium tracking-widest text-secondary uppercase"
          >
            Access Key / Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-secondary/70 border-b border-transparent focus:border-b-2 focus:border-primary focus:outline-none"
            placeholder="••••••••"
          />
          <div className="mt-2 flex justify-end">
            <Link href="/login" className="text-xs text-primary hover:underline">
              FORGOT KEY?
            </Link>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-surface-container px-3 py-2 text-sm text-primary">
            {error}
          </p>
        )}

        {successMessage && (
          <p
            role="status"
            className="rounded-xl bg-surface-container px-3 py-2 text-sm text-on-surface"
          >
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[linear-gradient(90deg,#9d4300_0%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "PROCESSING..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="my-4 text-center text-xs font-medium tracking-widest text-secondary uppercase">
        Or Continue As
      </p>

      <button
        type="button"
        onClick={handleContinueAsGuest}
        className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
      >
        CONTINUE AS GUEST
      </button>

      <p className="mt-6 text-center text-sm text-secondary">
        New to the observatory?{" "}
        <button type="button" onClick={handleToggleMode} className="font-semibold text-primary hover:underline">
          {mode === "signin" ? "Create Account" : "Sign In"}
        </button>
      </p>
    </section>
  );
}
