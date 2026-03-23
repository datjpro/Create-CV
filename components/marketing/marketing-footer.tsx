"use client";

import Link from "next/link";

import { MarketingAccountLink, MarketingResumeLink } from "@/components/marketing/marketing-auth-link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-[var(--font-headline)] text-lg font-bold text-on-surface">CV-Tech</div>
          <p className="mt-2 max-w-sm">Editorial resume building with live preview, template switching and ATS-friendly PDF export.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/templates" className="transition hover:text-on-surface">Templates</Link>
          <MarketingAccountLink className="transition hover:text-on-surface" guestLabel="Login" authenticatedLabel="Dashboard" />
          <MarketingResumeLink templateId="professional" className="transition hover:text-on-surface">Create CV</MarketingResumeLink>
          <Link href="/#pricing" className="transition hover:text-on-surface">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
