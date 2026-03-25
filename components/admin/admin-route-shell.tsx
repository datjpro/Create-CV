"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/auth-provider";

function readSearch() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
}

export function AdminRouteShell({ children }: { children: React.ReactNode }) {
  const { authMode, claimsLoading, isAdmin, loading, refreshClaims, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (authMode === "demo") {
      return;
    }

    if (!loading && !user) {
      const redirect = `${pathname}${readSearch()}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [authMode, loading, pathname, router, user]);

  if (authMode === "demo") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="max-w-lg rounded-[2rem] bg-surface-container-low p-10 text-center shadow-editorial">
          <h1 className="font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">Admin is not available</h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">Demo mode is active because Firebase is not configured.</p>
        </div>
      </main>
    );
  }

  if (loading || !user || claimsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="rounded-[2rem] bg-surface-container-low p-8 text-center shadow-editorial">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary-fixed" />
          <p className="mt-4 text-sm font-semibold text-on-surface-variant">Preparing admin...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="max-w-xl rounded-[2rem] bg-surface-container-low p-10 text-center shadow-editorial">
          <h1 className="font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">403</h1>
          <p className="mt-4 text-base leading-7 text-on-surface-variant">Your account does not have admin permissions.</p>
          <button
            type="button"
            onClick={() => refreshClaims()}
            className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
          >
            Refresh permissions
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
