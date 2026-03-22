"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";

function readRedirectTarget() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  return new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
}

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { authMode, loading, user, loginWithEmail, loginWithGithub, loginWithGoogle, registerWithEmail } = useAuth();
  const [redirectTarget, setRedirectTarget] = useState("/dashboard");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setRedirectTarget(readRedirectTarget());
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTarget);
    }
  }, [loading, redirectTarget, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      if (mode === "login") {
        await loginWithEmail({ email, password });
      } else {
        await registerWithEmail({ email, password, displayName });
      }

      router.replace(redirectTarget);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleProvider(provider: "google" | "github") {
    setPending(true);
    setError("");

    try {
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }

      router.replace(redirectTarget);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Provider sign in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="font-[var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">
          Architect CV
        </Link>
      </header>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-[2rem] bg-surface-container-low p-8 shadow-editorial sm:p-10">
            <div className="text-center">
              <h1 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface">
                {mode === "login" ? "Welcome back" : "Create your workspace"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                {mode === "login"
                  ? "Sign in to keep editing and exporting your resumes."
                  : "Create an account to save resumes, switch templates and export PDF."}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleProvider("google")}
                disabled={pending}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => handleProvider("github")}
                disabled={pending}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
              >
                GitHub
              </button>
            </div>

            <div className="relative my-6 flex items-center justify-center">
              <div className="h-px w-full bg-outline-variant/40" />
              <span className="absolute bg-surface-container-low px-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                or continue with email
              </span>
            </div>

            {authMode === "demo" ? (
              <div className="mb-5 rounded-2xl bg-primary-fixed px-4 py-3 text-sm leading-6 text-on-primary-fixed-variant">
                Demo mode is active because Firebase env variables are missing. Email, Google and GitHub flows still work locally for testing.
              </div>
            ) : null}

            {error ? <div className="mb-5 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" ? (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">Full name</label>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Alex Architect"
                    required
                    className="w-full rounded-xl border-0 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none ring-0 transition focus:bg-white focus:shadow-sm"
                  />
                </div>
              ) : null}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@architect.com"
                  required
                  className="w-full rounded-xl border-0 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none ring-0 transition focus:bg-white focus:shadow-sm"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">Password</label>
                  {mode === "login" ? <span className="text-xs font-semibold text-primary">Use any saved demo password</span> : null}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border-0 bg-surface-container-lowest px-4 py-3 text-on-surface outline-none ring-0 transition focus:bg-white focus:shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="premium-gradient w-full rounded-2xl px-4 py-4 font-bold text-on-primary shadow-float transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant">
              {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
              <Link
                href={mode === "login" ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : `/login?redirect=${encodeURIComponent(redirectTarget)}`}
                className="font-bold text-primary hover:underline"
              >
                {mode === "login" ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
