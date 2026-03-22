"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

type PrivatePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: Array<{ href: string; label: string }>;
};

export function PrivatePlaceholder({ eyebrow, title, description, actions = [] }: PrivatePlaceholderProps) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await logout();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-surface-container-low p-6 shadow-editorial md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Signed in as</div>
            <div className="mt-2 font-[var(--font-headline)] text-2xl font-extrabold text-on-surface">{user?.displayName}</div>
            <p className="mt-1 text-sm text-on-surface-variant">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/templates" className="rounded-xl bg-surface-container-lowest px-4 py-3 font-semibold text-on-surface transition hover:bg-white">
              Templates
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={pending}
              className="rounded-xl bg-primary px-4 py-3 font-semibold text-on-primary transition hover:opacity-95 disabled:opacity-60"
            >
              {pending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-paper-glow p-10 shadow-editorial">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
          <h1 className="mt-4 max-w-3xl font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-on-surface">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">{description}</p>
          {actions.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-4">
              {actions.map((action) => (
                <Link key={action.href} href={action.href} className="premium-gradient rounded-2xl px-5 py-3 font-bold text-on-primary transition hover:opacity-95">
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
