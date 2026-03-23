"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { buildResumeCreateHref, buildResumeStartHref } from "@/lib/template-library";
import type { TemplateId } from "@/lib/types";

type MarketingAuthLinkProps = PropsWithChildren<{
  templateId: TemplateId;
  className: string;
}>;

type MarketingAuthActionProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "children"> & {
  className: string;
  guestLabel: ReactNode;
  authenticatedLabel: ReactNode;
};

export function MarketingResumeLink({ templateId, className, children }: MarketingAuthLinkProps) {
  const { user } = useAuth();

  return (
    <Link href={user ? buildResumeCreateHref(templateId) : buildResumeStartHref(templateId)} className={className}>
      {children}
    </Link>
  );
}

export function MarketingAccountLink({ className, guestLabel, authenticatedLabel, ...props }: MarketingAuthActionProps) {
  const { user } = useAuth();

  return (
    <Link href={user ? "/dashboard" : "/login"} className={className} {...props}>
      {user ? authenticatedLabel : guestLabel}
    </Link>
  );
}
