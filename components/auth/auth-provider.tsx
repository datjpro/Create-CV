"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import {
  getResolvedAuthMode,
  initializeAuthPersistence,
  loginWithEmail,
  loginWithGithub,
  loginWithGoogle,
  logout,
  registerWithEmail,
  subscribeToAuthState
} from "@/lib/services/auth-service";
import type { AppUser } from "@/lib/types";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  authMode: "firebase" | "demo";
  loginWithEmail: (payload: { email: string; password: string }) => Promise<AppUser>;
  registerWithEmail: (payload: { email: string; password: string; displayName: string }) => Promise<AppUser>;
  loginWithGoogle: () => Promise<AppUser>;
  loginWithGithub: () => Promise<AppUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const authMode = getResolvedAuthMode();

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => {};

    const startSubscription = () => {
      if (!active) {
        return;
      }

      unsubscribe = subscribeToAuthState((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    };

    initializeAuthPersistence().catch(() => undefined).finally(startSubscription);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authMode,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginWithGithub,
      logout
    }),
    [user, loading, authMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
