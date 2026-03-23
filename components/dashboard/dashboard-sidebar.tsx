"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { logout } from "@/lib/services/auth-service";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "My Resumes" },
  { href: "/templates", label: "Templates" },
  { href: "/resume/new", label: "New Resume" }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await logout();
    router.replace("/login");
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-outline-variant/20 bg-surface-container-low p-5 lg:flex">
      <Link href="/" className="px-3 py-4 font-[var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">
        CV-Tech
      </Link>
      <div className="mt-4 rounded-[1.5rem] bg-surface-container-lowest p-4 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Workspace</div>
        <div className="mt-3 font-[var(--font-headline)] text-xl font-bold text-on-surface">{user?.displayName}</div>
        <p className="mt-1 text-sm text-on-surface-variant">{user?.email}</p>
      </div>
      <nav className="mt-8 space-y-2">
        {navigation.map((item) => {
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
                active ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-white/70 hover:text-on-surface"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={pending}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition hover:opacity-95 disabled:opacity-60"
        >
          {pending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}


