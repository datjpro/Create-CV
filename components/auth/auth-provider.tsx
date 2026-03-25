"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import { firebaseAuth } from "@/lib/firebase/client";
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
  claimsLoading: boolean;
  authMode: "firebase" | "demo";
  isAdmin: boolean;
  refreshClaims: () => Promise<void>;
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
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    if (authMode !== "firebase") {
      setClaimsLoading(false);
      setIsAdmin(false);
      return;
    }

    if (!user) {
      setClaimsLoading(false);
      setIsAdmin(false);
      return;
    }

    if (!firebaseAuth?.currentUser) {
      setClaimsLoading(false);
      setIsAdmin(false);
      return;
    }

    let active = true;
    setClaimsLoading(true);

    void firebaseAuth.currentUser
      .getIdTokenResult()
      .then((result) => {
        if (!active) {
          return;
        }

        setIsAdmin(result.claims.admin === true);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setIsAdmin(false);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setClaimsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authMode, user]);
  const refreshClaims = useCallback(async () => {
    if (authMode !== "firebase") {
      return;
    }

    if (!firebaseAuth?.currentUser) {
      return;
    }

    setClaimsLoading(true);

    try {
      const result = await firebaseAuth.currentUser.getIdTokenResult(true);
      setIsAdmin(result.claims.admin === true);
    } catch {
      setIsAdmin(false);
    } finally {
      setClaimsLoading(false);
    }
  }, [authMode]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      claimsLoading,
      authMode,
      isAdmin,
      refreshClaims,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginWithGithub,
      logout
    }),
    [user, loading, claimsLoading, authMode, isAdmin, refreshClaims]
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
