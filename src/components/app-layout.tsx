"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Hide navbar on login (and any nested auth routes if added later)
  const hasNavbar = !(pathname === "/login" || pathname?.startsWith("/login/"));

  // Prefetch key dashboard routes to make navigation snappy
  useEffect(() => {
    if (!hasNavbar) return;
    const routes = [
      "/dashboard/new-lead",
      "/dashboard/new-disbursement",
      "/dashboard/my-leads",
      "/dashboard/my-disbursements",
    ];
    routes.forEach((r) => router.prefetch(r));
  }, [hasNavbar, router]);

  return (
    <>
      {hasNavbar && <Navbar />}
      <div className={hasNavbar ? "pt-14 print:pt-0 min-h-screen bg-[#FFFFFF]" : "min-h-screen bg-[#FFFFFF]"}>
        {children}
      </div>
    </>
  );
}
