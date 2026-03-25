"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";
import { SettingsProvider } from "@/components/settings/settings-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </AuthProvider>
  );
}
