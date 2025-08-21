"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const logoutReq = fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
      await Promise.race([logoutReq, timeout]);
    } finally {
      router.replace("/login");
      setBusy(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14  border-b shadow-sm z-50 bg-[#142F45]
      print:static print:h-auto print:bg-white print:shadow-none print:border-0">
      <div className="mx-auto max-w-screen-2xl h-full px-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-white tracking-wide print:text-black">Wheels Web</div>
        <div className="print:hidden">
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={busy} className="min-w-24">
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Logging out…
              </span>
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
