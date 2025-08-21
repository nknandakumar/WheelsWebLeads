"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewLeadForm = dynamic(() => import("@/components/dashboard/new-lead-form").then(m => m.NewLeadForm), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-sm text-gray-600">Loading form…</div>
  ),
});

export default function NewLeadPage() {
	return (
		<div className="flex flex-col justify-center h-full p-6">
			<header className="mb-6">
				<Link href="/dashboard" prefetch className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-black hover:bg-gray-100">
					<ArrowLeft className="h-4 w-4" />
					Back to Dashboard
				</Link>
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
