"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { logout } from "@/lib/services/auth-service";

export function DashboardMobileBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await logout();
    router.replace("/login");
  }

  return (
    <div className="mb-8 rounded-[1.75rem] bg-surface-container-low p-4 shadow-sm lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Workspace</div>
          <div className="mt-2 font-[var(--font-headline)] text-2xl font-extrabold text-on-surface">{user?.displayName}</div>
          <p className="mt-1 text-sm text-on-surface-variant">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={pending}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary transition hover:opacity-95 disabled:opacity-60"
        >
          {pending ? "Logging out..." : "Logout"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/resume/new" className="premium-gradient rounded-xl px-4 py-2 text-sm font-bold text-on-primary">
          New resume
        </Link>
        <Link href="/templates" className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface">
          Templates
        </Link>
        <Link href="/settings" className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface">
          Settings
        </Link>
      </div>
    </div>
  );
}
