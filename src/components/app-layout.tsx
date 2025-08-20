"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasNavbar = pathname !== "/"; // hide on login page

  return (
    <>
      {hasNavbar && <Navbar />}
      <div className={hasNavbar ? "pt-14 print:pt-0 min-h-screen bg-[#FFFFFF]" : "min-h-screen bg-[#FFFFFF]"}>
        {children}
      </div>
    </>
  );
}
