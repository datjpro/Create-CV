"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MarketingAccountLink, MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { PublicPreferenceControls } from "@/components/settings/public-preference-controls";
import { useI18n } from "@/components/settings/use-i18n";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const pathname = usePathname();
  const { copy } = useI18n();

  const links = [
    { href: "/templates", label: copy.marketing.header.templates },
    { href: "/dashboard", label: copy.marketing.header.dashboard },
    { href: "/#pricing", label: copy.marketing.header.pricing }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/20 glass-panel">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="font-[var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">
          {copy.common.brandName}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === "/" ? false : pathname.startsWith(link.href.replace("/#pricing", ""));
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
        <div className="flex flex-wrap items-center justify-end gap-3">
          <PublicPreferenceControls />
          <MarketingAccountLink
            className="rounded-xl px-4 py-2 font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            guestLabel={copy.marketing.header.login}
            authenticatedLabel={copy.marketing.header.dashboard}
          />
          <MarketingResumeLink
            templateId="professional"
            className="premium-gradient rounded-xl px-5 py-2.5 font-bold text-on-primary transition hover:opacity-95"
          >
            {copy.marketing.header.createCv}
          </MarketingResumeLink>
        </div>
      </div>
    </header>
  );
}

