"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function LoginPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [role, setRole] = useState<"user" | "admin">("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorItems, setErrorItems] = useState<string[]>([]);

  // Prefetch the next route to make post-login navigation instant
  useEffect(() => {
    if (next.startsWith("/")) router.prefetch(next);
  }, [next, router]);

  // Client-side guard: if already authenticated, redirect away from /login (extra safety)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" });
        const data = await res.json();
        if (!cancelled && data?.authenticated) {
          const target = data.role === "admin" ? "/admin" : (next || "/dashboard");
          router.replace(target);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [router, next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!username.trim()) errs.push("Username is required");
    if (!password) errs.push("Password is required");
    if (errs.length) {
      setErrorItems(errs);
      setErrorOpen(true);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, role }),
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Login failed");
      toast({ title: "Signed in", description: `Welcome ${username.trim() || ""}` });
      const resolvedRole: "admin" | "user" = data.role === "admin" ? "admin" : "user";
      if (resolvedRole === "admin") {
        const target = next === "/" || next === "/dashboard" ? "/admin" : next;
        router.refresh();
        router.replace(target);
        setTimeout(() => {
          if (window?.location?.pathname !== target) window.location.assign(target);
        }, 0);
      } else {
        router.refresh();
        router.replace(next);
        setTimeout(() => {
          if (window?.location?.pathname !== next) window.location.assign(next);
        }, 0);
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.message || "Unable to sign in", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen w-full flex items-center md:items-center justify-center bg-gray-50 py-10">
        <div className="w-full max-w-md px-4">
          <h1 className="text-4xl font-extrabold text-center mb-8">Wheels Web</h1>
          <Card className="shadow-sm">
            <CardHeader className="flex items-center justify-center">
              <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <div className="flex gap-2">
                    <Button type="button" variant={role === "user" ? "default" : "secondary"} onClick={() => setRole("user")}>User</Button>
                    <Button type="button" variant={role === "admin" ? "default" : "secondary"} onClick={() => setRole("admin")}>Admin</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="bg-blue-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      className="bg-blue-50 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute inset-y-0 right-2 my-auto h-8 px-2 rounded text-sm text-gray-600 hover:text-gray-900"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validation error</AlertDialogTitle>
            <AlertDialogDescription>
              <ul className="list-disc pl-5 space-y-1">
                {errorItems.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center"><div className="text-sm text-gray-600">Loading…</div></main>}>
      <LoginPageInner />
    </Suspense>
  );
}
