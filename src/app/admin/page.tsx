"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getCredentials, setUserCredentials } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [editingUser, setEditingUser] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Guard: only admin can access
  useEffect(() => {
    const { isAuthenticated, role } = getAuth();
    if (!isAuthenticated || role !== "admin") {
      router.replace("/login");
      return;
    }
    const u = getCredentials("user");
    setUserUsername(String(u.username));
    setUserPassword(String(u.password));
    const a = getCredentials("admin");
    setAdminUsername(String(a.username));
    setAdminPassword(String(a.password));
  }, [router]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const saveUserUsername = () => {
    setUserCredentials(userUsername, userPassword);
    setEditingUser((e) => ({ ...e, username: false }));
  };

  const saveUserPassword = () => {
    setUserCredentials(userUsername, userPassword);
    setEditingUser((e) => ({ ...e, password: false }));
  };

  return (
    <main className="min-h-screen w-full flex items-start md:items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-2xl font-semibold mb-6">Admin Panel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage user credentials (demo)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Credentials */}
            <section>
              <h2 className="text-sm font-medium mb-3">User Credentials</h2>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-center mb-4">
                <label className="text-sm text-gray-700">Username</label>
                <Input
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  readOnly={!editingUser.username}
                  className="bg-blue-50"
                />
                {editingUser.username ? (
                  <Button onClick={saveUserUsername}>Save</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => copy(userUsername)}>Copy</Button>
                    <Button onClick={() => setEditingUser((e) => ({ ...e, username: true }))}>Change</Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-center">
                <label className="text-sm text-gray-700">Password</label>
                <Input
                  type={editingUser.password ? "text" : "password"}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  readOnly={!editingUser.password}
                  className="bg-blue-50"
                />
                {editingUser.password ? (
                  <Button onClick={saveUserPassword}>Save</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => copy(userPassword)}>Copy</Button>
                    <Button onClick={() => setEditingUser((e) => ({ ...e, password: true }))}>Change</Button>
                  </div>
                )}
              </div>
            </section>

            <hr className="my-2" />

            {/* Admin Credentials (read-only) */}
            <section>
              <h2 className="text-sm font-medium mb-3">Admin Credentials (read-only)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Admin Username</label>
                  <Input value={adminUsername} readOnly className="bg-blue-50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Admin Password</label>
                  <Input type="password" value={adminPassword} readOnly className="bg-blue-50" />
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
