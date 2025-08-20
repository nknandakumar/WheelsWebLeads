"use client";

import { NewLeadForm } from "@/components/dashboard/new-lead-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewLeadPage() {
	const router = useRouter();

	return (
		<div className="flex flex-col justify-center h-full p-6">
			<header className="mb-6">
				<Button
					variant="ghost"
					onClick={() => router.push("/dashboard")}
					className="flex items-center gap-2 text-black hover:bg-gray-100"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Dashboard
				</Button>
				<hr className="my-4 px-0 mx-0 border-gray-400" />
				<div className="flex items-center flex-col justify-between">
					<h1 className="text-2xl font-bold">New Lead Entries</h1>
					<div className="w-[120px]"></div>
				</div>
			</header>
			<main className="flex-1 border border-black rounded-2xl px-4 py-4">
				<NewLeadForm />
			</main>
		</div>
	);
}
