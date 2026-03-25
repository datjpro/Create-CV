"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/templates", label: "Templates" },
    { href: "/admin/marketing", label: "Marketing" },
    { href: "/dashboard", label: "Back to dashboard" }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-outline-variant/20 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <div className="font-[var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">Admin</div>
          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    active ? "bg-surface-container-high text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">{children}</div>
    </div>
  );
}
