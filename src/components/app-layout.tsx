"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide navbar on login (and any nested auth routes if added later)
  const hasNavbar = !(pathname === "/login" || pathname?.startsWith("/login/"));

  return (
    <>
      {hasNavbar && <Navbar />}
      <div className={hasNavbar ? "pt-14 print:pt-0 min-h-screen bg-[#FFFFFF]" : "min-h-screen bg-[#FFFFFF]"}>
        {children}
      </div>
    </>
  );
}
