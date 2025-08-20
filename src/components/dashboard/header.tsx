"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const showBackButton = pathname !== "/dashboard";

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-sm border-b p-2 flex items-center gap-2 md:left-[var(--sidebar-width)] peer-data-[collapsible=icon]:md:left-[var(--sidebar-width-icon)] transition-[left] ease-linear">
      <SidebarTrigger className="md:hidden" />
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
          <span className="sr-only">Back</span>
        </Button>
      )}
      {/* You can add more header content here if needed */}
    </header>
  );
}
