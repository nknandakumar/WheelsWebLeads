"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14  border-b shadow-sm z-50 bg-[#142F45]
      print:static print:h-auto print:bg-white print:shadow-none print:border-0">
      <div className="mx-auto max-w-screen-2xl h-full px-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-white tracking-wide print:text-black">Wheels Web</div>
        <div className="print:hidden">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
