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

export function PrivateRouteShell({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const redirect = `${pathname}${readSearch()}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="rounded-[2rem] bg-surface-container-low p-8 text-center shadow-editorial">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary-fixed" />
          <p className="mt-4 text-sm font-semibold text-on-surface-variant">Preparing your workspace...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
