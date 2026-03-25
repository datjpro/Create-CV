"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";
import { AppContentProvider } from "@/components/content/app-content-provider";
import { SettingsProvider } from "@/components/settings/settings-provider";
import { TemplateCatalogProvider } from "@/components/templates/template-catalog-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContentProvider>
          <TemplateCatalogProvider>{children}</TemplateCatalogProvider>
        </AppContentProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
