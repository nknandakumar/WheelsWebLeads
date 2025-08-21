"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Role = "admin" | "user";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [editing, setEditing] = useState<{ userU: boolean; userP: boolean; adminU: boolean; adminP: boolean }>({ userU: false, userP: false, adminU: false, adminP: false });
  const [showUserPass, setShowUserPass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorItems, setErrorItems] = useState<string[]>([]);
  const [copied, setCopied] = useState({ userU: false, userP: false, userBoth: false, adminU: false, adminP: false });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/admin/credentials", { cache: "no-store" });
        if (resp.status === 403) {
          router.replace("/login");
          return;
        }
        const data = await resp.json();
        const list: Array<{ role: Role; username: string; password?: string }> = data.credentials || [];
        const a = list.find(i => i.role === "admin");
        const u = list.find(i => i.role === "user");
        if (a) {
          setAdminUsername(a.username);
          if (a.password !== undefined) setAdminPassword(a.password);
        }
        if (u) {
          setUserUsername(u.username);
          if (u.password !== undefined) setUserPassword(u.password);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load credentials");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const save = async (role: Role) => {
    const isAdmin = role === "admin";
    const username = (isAdmin ? adminUsername : userUsername).trim();
    const password = isAdmin ? adminPassword : userPassword;

    // Prepare partial update based on which fields are in edit mode
    const payload: any = { role };
    if ((isAdmin && editing.adminU) || (!isAdmin && editing.userU)) {
      if (!username) {
        setErrorItems(["Username cannot be empty"]);
        setErrorOpen(true);
        return;
      }
      payload.username = username;
    }
    if ((isAdmin && editing.adminP) || (!isAdmin && editing.userP)) {
      if (!password) {
        setErrorItems(["Password cannot be empty"]);
        setErrorOpen(true);
        return;
      }
      payload.password = password;
    }
    if (payload.username === undefined && payload.password === undefined) {
      toast({ title: "No changes", description: "Nothing to update" });
      return;
    }
    try {
      const resp = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const d = await resp.json().catch(() => ({}));
        throw new Error(d?.error || "Update failed");
      }
      toast({ title: "Updated", description: `${isAdmin ? "Admin" : "User"} credentials saved` });
      setEditing((e) => ({ ...e, ...(role === "admin" ? { adminU: false, adminP: false } : { userU: false, userP: false }) }));
      // Keep the current password in state so it stays visible after save
      if (payload.password !== undefined) {
        if (role === "admin") setShowAdminPass(true);
        if (role === "user") setShowUserPass(true);
      }
      // Refresh from server so UI matches DB immediately
      try {
        const r = await fetch("/api/admin/credentials", { cache: "no-store" });
        const data = await r.json();
        const list: Array<{ role: Role; username: string; password?: string }> = data.credentials || [];
        const a = list.find(i => i.role === "admin");
        const u = list.find(i => i.role === "user");
        if (a) {
          setAdminUsername(a.username);
          if (a.password !== undefined) setAdminPassword(a.password);
        }
        if (u) {
          setUserUsername(u.username);
          if (u.password !== undefined) setUserPassword(u.password);
        }
      } catch {}
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Unable to save credentials", variant: "destructive" });
    }
  };

  const logout = () => {
    // make logout instant
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const copyUserBoth = async () => {
    const payload = `Username :- ${userUsername}\nPassword :- ${userPassword}`;
    copy(payload);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <>
    <main className="min-h-screen w-full flex items-start md:items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-3xl px-4">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Credentials */}
            <section>
              <h2 className="text-sm font-medium mb-3">User Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Username</label>
                  <Input value={userUsername} onChange={(e) => setUserUsername(e.target.value)} readOnly={!editing.userU} className="bg-blue-50" />
                </div>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await copy(userUsername);
                    setCopied((c) => ({ ...c, userU: true }));
                    setTimeout(() => setCopied((c) => ({ ...c, userU: false })), 1500);
                  }}
                >
                  {copied.userU ? "Copied" : "Copy"}
                </Button>
                {editing.userU ? (
                  <Button onClick={() => save("user")}>Save</Button>
                ) : (
                  <Button onClick={() => setEditing((e) => ({ ...e, userU: true }))}>Change</Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Password</label>
                  <Input type={showUserPass ? "text" : "password"} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} readOnly={!editing.userP} className="bg-blue-50" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await copy(userPassword);
                      setCopied((c) => ({ ...c, userP: true }));
                      setTimeout(() => setCopied((c) => ({ ...c, userP: false })), 1500);
                    }}
                  >
                    {copied.userP ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowUserPass((v) => !v)}>{showUserPass ? "Hide" : "Show"}</Button>
                </div>
                {editing.userP ? (
                  <Button onClick={() => save("user")}>Save</Button>
                ) : (
                  <Button onClick={() => setEditing((e) => ({ ...e, userP: true }))}>Change</Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    await copyUserBoth();
                    setCopied((c) => ({ ...c, userBoth: true }));
                    setTimeout(() => setCopied((c) => ({ ...c, userBoth: false })), 1500);
                  }}
                >
                  {copied.userBoth ? "Copied" : "Copy Username & Password"}
                </Button>
              </div>
            </section>

            <hr className="my-2" />

            {/* Admin Credentials */}
            <section>
              <h2 className="text-sm font-medium mb-3">Admin Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Admin Username</label>
                  <Input value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} readOnly={!editing.adminU} className="bg-blue-50" />
                </div>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await copy(adminUsername);
                    setCopied((c) => ({ ...c, adminU: true }));
                    setTimeout(() => setCopied((c) => ({ ...c, adminU: false })), 1500);
                  }}
                >
                  {copied.adminU ? "Copied" : "Copy"}
                </Button>
                {editing.adminU ? (
                  <Button onClick={() => save("admin")}>Save</Button>
                ) : (
                  <Button onClick={() => setEditing((e) => ({ ...e, adminU: true }))}>Change</Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Admin Password</label>
                  <Input type={showAdminPass ? "text" : "password"} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} readOnly={!editing.adminP} className="bg-blue-50" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await copy(adminPassword);
                      setCopied((c) => ({ ...c, adminP: true }));
                      setTimeout(() => setCopied((c) => ({ ...c, adminP: false })), 1500);
                    }}
                  >
                    {copied.adminP ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAdminPass((v) => !v)}>{showAdminPass ? "Hide" : "Show"}</Button>
                </div>
                {editing.adminP ? (
                  <Button onClick={() => save("admin")}>Save</Button>
                ) : (
                  <Button onClick={() => setEditing((e) => ({ ...e, adminP: true }))}>Change</Button>
                )}
              </div>
            </section>
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
