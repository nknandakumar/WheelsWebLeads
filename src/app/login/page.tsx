"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, getCredentials, type Role, getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authed, send to appropriate page
  useEffect(() => {
    const { isAuthenticated, role } = getAuth();
    if (isAuthenticated && role) {
      router.replace(role === "admin" ? "/admin" : "/dashboard");
    }
  }, [router]);

  // Prefill with demo creds per role
  useEffect(() => {
    const demo = getCredentials(role);
    setUsername(String(demo.username));
    setPassword(String(demo.password));
  }, [role]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = login(role, username.trim(), password);
    setLoading(false);
    if (res.ok) {
      router.replace(role === "admin" ? "/admin" : "/dashboard");
    } else {
      alert(res.message || "Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-start md:items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8">Wheels Web</h1>
        <Card className="shadow-sm">
          <CardHeader>
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
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user@example.com" className="bg-blue-50" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="user123" className="bg-blue-50" />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-xs text-gray-600 pt-2">
                For demo:<br />
                Admin: admin@example.com / admin123<br />
                User: user@example.com / user123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
