"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
            router.replace("/");
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-white">
            <main className="flex-1">{children}</main>
        </div>
    );
}
