"use client";

export type Role = "user" | "admin";

const LS_KEYS = {
  isAuthenticated: "auth:isAuthenticated",
  role: "auth:role",
  userUsername: "auth:user:username",
  userPassword: "auth:user:password",
  adminUsername: "auth:admin:username",
  adminPassword: "auth:admin:password",
} as const;

const DEFAULTS = {
  user: { username: "user@example.com", password: "user123" },
  admin: { username: "admin@example.com", password: "admin123" },
};

export function getStored<T = string>(key: string, fallback: T extends string ? string : T): any {
  if (typeof window === "undefined") return fallback as any;
  const v = window.localStorage.getItem(key);
  return v ?? (fallback as any);
}

export function setStored(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function ensureDefaults() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(LS_KEYS.userUsername)) setStored(LS_KEYS.userUsername, DEFAULTS.user.username);
  if (!window.localStorage.getItem(LS_KEYS.userPassword)) setStored(LS_KEYS.userPassword, DEFAULTS.user.password);
  if (!window.localStorage.getItem(LS_KEYS.adminUsername)) setStored(LS_KEYS.adminUsername, DEFAULTS.admin.username);
  if (!window.localStorage.getItem(LS_KEYS.adminPassword)) setStored(LS_KEYS.adminPassword, DEFAULTS.admin.password);
}

export function getCredentials(role: Role) {
  ensureDefaults();
  if (role === "admin") {
    return {
      username: getStored(LS_KEYS.adminUsername, DEFAULTS.admin.username),
      password: getStored(LS_KEYS.adminPassword, DEFAULTS.admin.password),
    };
  }
  return {
    username: getStored(LS_KEYS.userUsername, DEFAULTS.user.username),
    password: getStored(LS_KEYS.userPassword, DEFAULTS.user.password),
  };
}

export function setUserCredentials(username: string, password: string) {
  setStored(LS_KEYS.userUsername, username);
  setStored(LS_KEYS.userPassword, password);
}

export function login(role: Role, username: string, password: string): { ok: boolean; message?: string } {
  const creds = getCredentials(role);
  const ok = creds.username === username && creds.password === password;
  if (ok) {
    setStored(LS_KEYS.isAuthenticated, "true");
    setStored(LS_KEYS.role, role);
  }
  return ok ? { ok: true } : { ok: false, message: "Invalid credentials" };
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEYS.isAuthenticated);
  window.localStorage.removeItem(LS_KEYS.role);
}

export function getAuth() {
  if (typeof window === "undefined") return { isAuthenticated: false, role: undefined as Role | undefined };
  const isAuthenticated = window.localStorage.getItem(LS_KEYS.isAuthenticated) === "true";
  const role = (window.localStorage.getItem(LS_KEYS.role) as Role | null) ?? undefined;
  return { isAuthenticated, role };
}
