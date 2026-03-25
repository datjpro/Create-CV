"use client";

import Link from "next/link";

import { MarketingAccountLink, MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { useI18n } from "@/components/settings/use-i18n";

export function MarketingFooter() {
  const { copy } = useI18n();

  return (
    <footer className="border-t border-outline-variant/20 bg-surface px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-[var(--font-headline)] text-lg font-bold text-on-surface">{copy.common.brandName}</div>
          <p className="mt-2 max-w-sm">{copy.marketing.footer.description}</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/templates" className="transition hover:text-on-surface">{copy.marketing.footer.templates}</Link>
          <MarketingAccountLink className="transition hover:text-on-surface" guestLabel={copy.marketing.footer.login} authenticatedLabel={copy.marketing.footer.dashboard} />
          <MarketingResumeLink templateId="professional" className="transition hover:text-on-surface">{copy.marketing.footer.createCv}</MarketingResumeLink>
          <Link href="/#pricing" className="transition hover:text-on-surface">{copy.marketing.footer.pricing}</Link>
        </div>
      </div>
    </footer>
  );
}

