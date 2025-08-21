"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	Car,
	LayoutDashboard,
	FilePlus,
	Files,
	FileText,
	FileBarChart2,
	LogOut,
	Loader2,
	PanelLeft,
} from "lucide-react";

import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
	const pathname = usePathname();
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

	const menuItems = [
		{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ href: "/dashboard/new-lead", label: "New Lead", icon: FilePlus },
		{ href: "/dashboard/my-leads", label: "My Leads", icon: Files },
		{
			href: "/dashboard/new-disbursement",
			label: "New Disbursement",
			icon: FileText,
		},
		{
			href: "/dashboard/my-disbursements",
			label: "My Disbursements",
			icon: FileBarChart2,
		},
	];

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" className="md:hidden">
						<PanelLeft />
					</Button>
					<div className="flex items-center gap-2 p-2">
						<div className="bg-primary text-primary-foreground p-2 rounded-lg">
							<Car className="h-6 w-6" />
						</div>
						<h1 className="text-xl font-semibold text-primary">Wheels Web</h1>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<Link href={item.href} prefetch>
								<SidebarMenuButton
									isActive={pathname === item.href}
									tooltip={{ children: item.label }}
								>
									<item.icon />
									<span>{item.label}</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<Button
					variant="ghost"
					className="w-full justify-start gap-2 min-h-9"
					onClick={handleLogout}
					disabled={busy}
				>
					{busy ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							<span>Logging out…</span>
						</>
					) : (
						<>
							<LogOut className="h-4 w-4" />
							<span>Logout</span>
						</>
					)}
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
