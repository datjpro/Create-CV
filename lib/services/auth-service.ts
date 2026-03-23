"use client";

import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase/client";
import type { AppUser, AuthProviderId } from "@/lib/types";

const DEMO_USERS_KEY = "create-cv-demo-users";
const DEMO_SESSION_KEY = "create-cv-demo-session";

type StoredDemoUser = AppUser & {
  password: string;
};

type AuthMode = "firebase" | "demo";

type AuthPayload = {
  email: string;
  password: string;
  displayName?: string;
};

const demoListeners = new Set<(user: AppUser | null) => void>();
let firebasePersistencePromise: Promise<void> | null = null;

function getAuthMode(): AuthMode {
  return firebaseAuth ? "firebase" : "demo";
}

function mapFirebaseUser(user: User): AppUser {
  const providerId = (user.providerData[0]?.providerId ?? "password") as string;
  const provider: AuthProviderId = providerId.includes("google")
    ? "google"
    : providerId.includes("github")
      ? "github"
      : "password";

  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? user.email?.split("@")[0] ?? "User",
    photoURL: user.photoURL ?? undefined,
    provider
  };
}

function getDemoUsers(): StoredDemoUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DEMO_USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredDemoUser[]) : [];
}

function setDemoUsers(users: StoredDemoUser[]) {
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getDemoSession(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
  return raw ? (JSON.parse(raw) as AppUser) : null;
}

function setDemoSession(user: AppUser | null) {
  if (user) {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  }

  demoListeners.forEach((listener) => listener(user));
}

function subscribeToDemoAuth(listener: (user: AppUser | null) => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === DEMO_SESSION_KEY || event.key === DEMO_USERS_KEY) {
      listener(getDemoSession());
    }
  };

  demoListeners.add(listener);
  listener(getDemoSession());
  window.addEventListener("storage", handleStorage);

  return () => {
    demoListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function buildDemoUser(provider: AuthProviderId, email: string, displayName: string): AppUser {
  return {
    uid: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${provider}-${Date.now()}`,
    email,
    displayName,
    provider
  };
}

function providerIdentity(provider: AuthProviderId) {
  if (provider === "google") {
    return {
      email: "google.user@demo.local",
      displayName: "Google Candidate"
    };
  }

  return {
    email: "github.user@demo.local",
    displayName: "GitHub Candidate"
  };
}

export function getResolvedAuthMode() {
  return getAuthMode();
}

export function initializeAuthPersistence() {
  if (!firebaseAuth || typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!firebasePersistencePromise) {
    firebasePersistencePromise = setPersistence(firebaseAuth, browserLocalPersistence).catch((error) => {
      firebasePersistencePromise = null;
      throw error;
    });
  }

  return firebasePersistencePromise;
}

export function subscribeToAuthState(listener: (user: AppUser | null) => void) {
  if (firebaseAuth) {
    return onAuthStateChanged(firebaseAuth, (user) => {
      listener(user ? mapFirebaseUser(user) : null);
    });
  }

  return subscribeToDemoAuth(listener);
}

export async function registerWithEmail(payload: AuthPayload) {
  if (firebaseAuth) {
    await initializeAuthPersistence();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);

    if (payload.displayName) {
      await updateProfile(credential.user, {
        displayName: payload.displayName
      });
    }

    return mapFirebaseUser(credential.user);
  }

  const users = getDemoUsers();
  const email = payload.email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  const user = buildDemoUser("password", email, payload.displayName?.trim() || email.split("@")[0]);
  const storedUser: StoredDemoUser = {
    ...user,
    password: payload.password
  };

  users.push(storedUser);
  setDemoUsers(users);
  setDemoSession(user);

  return user;
}

export async function loginWithEmail(payload: AuthPayload) {
  if (firebaseAuth) {
    await initializeAuthPersistence();
    const credential = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
    return mapFirebaseUser(credential.user);
  }

  const email = payload.email.trim().toLowerCase();
  const user = getDemoUsers().find((entry) => entry.email.toLowerCase() === email && entry.password === payload.password);

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  const sessionUser: AppUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: user.provider
  };

  setDemoSession(sessionUser);
  return sessionUser;
}

export async function loginWithGoogle() {
  if (firebaseAuth) {
    await initializeAuthPersistence();
    const credential = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    return mapFirebaseUser(credential.user);
  }

  const identity = providerIdentity("google");
  const user = buildDemoUser("google", identity.email, identity.displayName);
  setDemoSession(user);
  return user;
}

export async function loginWithGithub() {
  if (firebaseAuth) {
    await initializeAuthPersistence();
    const credential = await signInWithPopup(firebaseAuth, new GithubAuthProvider());
    return mapFirebaseUser(credential.user);
  }

  const identity = providerIdentity("github");
  const user = buildDemoUser("github", identity.email, identity.displayName);
  setDemoSession(user);
  return user;
}

export async function logout() {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
    return;
  }

  setDemoSession(null);
}
