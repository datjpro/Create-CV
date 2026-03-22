"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buildResumeStartHref } from "@/lib/template-library";
import { cn } from "@/lib/utils";

const links = [
  { href: "/templates", label: "Templates" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#pricing", label: "Pricing" }
];

export function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/20 glass-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-[var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">
          Architect CV
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === "/" ? link.href === "/templates" ? false : false : pathname.startsWith(link.href.replace("/#pricing", ""));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b-2 border-transparent pb-1 font-[var(--font-headline)] text-sm font-bold tracking-tight text-on-surface-variant transition hover:text-on-surface",
                  active && "border-primary text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 font-semibold text-on-surface-variant transition hover:bg-surface-container-low">
            Login
          </Link>
          <Link href={buildResumeStartHref("professional")} className="premium-gradient rounded-xl px-5 py-2.5 font-bold text-on-primary transition hover:opacity-95">
            Create CV
          </Link>
        </div>
      </div>
    </header>
  );
}
