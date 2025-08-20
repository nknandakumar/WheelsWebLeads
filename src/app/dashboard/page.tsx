"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, Users, CircleDollarSign, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionCard } from "@/components/dashboard/action-card";

export default function DashboardPage() {
	const router = useRouter();

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("isAuthenticated");
		}
		router.replace("/");
	};

	return (
		<div className="min-h-screen bg-green-100 flex flex-col">


			<main className="flex-1">
				<div className="mx-auto w-full max-w-6xl px-4 py-10">
					<div className="flex flex-col justify-center items-center space-y-2 mb-10">
						<h1 className="text-4xl sm:text-3xl md:text-6xl lg:text-7xl  text-center font-bold tracking-tight">
							Wheels Web
						</h1>
						<h2 className="text-center md:text-lg lg:text-xl mb-4">
							Store and Track customer leads and loan disbursements all in one
							convenient place
						</h2>
					</div>
					{(() => {
						const actions = [
							{
								title: "New Lead",
								description: "Create a new lead record",
								href: "/dashboard/new-lead",
								Icon: UserPlus,
								ctaLabel: "Create",
							},
							{
								title: "My Leads",
								description: "Browse and manage leads",
								href: "/dashboard/my-leads",
								Icon: Users,
								ctaLabel: "Open",
							},
							{
								title: "New Disbursement",
								description: "Create a new disbursement",
								href: "/dashboard/new-disbursement",
								Icon: CircleDollarSign,
								ctaLabel: "Create",
							},
							{
								title: "My Disbursements",
								description: "Review past disbursements",
								href: "/dashboard/my-disbursements",
								Icon: ClipboardList,
								ctaLabel: "Open",
							},
						];

						return (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-stretch">
								{actions.map((action) => (
									<ActionCard key={action.title} {...action} />
								))}
							</div>
						);
					})()}
				</div>
			</main>
		</div>
	);
}
