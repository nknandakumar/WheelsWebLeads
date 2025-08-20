"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Car,
	LayoutDashboard,
	FilePlus,
	Files,
	FileText,
	FileBarChart2,
	LogOut,
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

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("isAuthenticated");
		}
		router.push("/");
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
							<Link href={item.href}>
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
					className="w-full justify-start gap-2"
					onClick={handleLogout}
				>
					<LogOut className="h-4 w-4" />
					<span>Logout</span>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
