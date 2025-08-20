"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const { isAuthenticated } = getAuth();
        if (!isAuthenticated) router.replace("/login");
    }, [router]);

    return (
        <div className="min-h-screen bg-white">
            <main className="flex-1">{children}</main>
        </div>
    );
}
