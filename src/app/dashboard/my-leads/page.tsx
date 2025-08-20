"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getLeads, getLeadsCount } from "@/lib/data";
import type { Lead } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LeadsTable = dynamic(
    () => import("@/components/dashboard/leads-table").then(m => m.LeadsTable),
    { ssr: false, loading: () => <p>Loading table...</p> }
);

export default function MyLeadsPage() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const pageSize = 25;
	const [totalLeads, setTotalLeads] = useState(0);

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				setLoading(true);
				const [leadsData, totalCount] = await Promise.all([
					getLeads(page * pageSize, pageSize),
					getLeadsCount(),
				]);
				setLeads(leadsData);
				setTotalLeads(totalCount);
			} catch (error) {
				console.error("Error fetching leads:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLeads();
	}, [page]);

	const filteredLeads = useMemo(() => {
		const base = !searchTerm
			? leads
			: leads.filter((lead) =>
					Object.values(lead).some((value) =>
						String(value).toLowerCase().includes(searchTerm.toLowerCase())
					)
			  );
		// Sort by dateTime (most recent first)
		return [...base].sort((a, b) => {
			const ta = a.dateTime ? Date.parse(a.dateTime) : 0;
			const tb = b.dateTime ? Date.parse(b.dateTime) : 0;
			return tb - ta;
		});
	}, [leads, searchTerm]);

	return (
		<div className="flex flex-col h-full p-6">
			<header className="mb-6">
				<div className="flex items-center gap-4 mb-4">
					<Link href="/dashboard" prefetch className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Link>
				</div>
				<hr className="my-4 px-0 mx-0 border-gray-400" />
				<div className="flex justify-between flex-col md:flex-row items-center">
					<h1 className="text-2xl font-bold">My Leads</h1>
					<div className="w-full flex gap-2 justify-baseline max-w-sm">
						<Input
							placeholder="Search 🔍"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="bg-green-100 border border-green-500"
						/>
					</div>
				</div>
			</header>
			<main className="flex-1">
				{loading ? (
					<p>Loading leads...</p>
				) : (
					<>
						<LeadsTable leads={filteredLeads} />
						<div className="flex justify-between items-center mt-4">
							<button
								onClick={() => setPage((p) => Math.max(0, p - 1))}
								disabled={page === 0}
							>
								Previous
							</button>
							<span>
								Page {page + 1} of {Math.ceil(totalLeads / pageSize)}
							</span>
							<button
								onClick={() =>
									setPage((p) =>
										p + 1 < Math.ceil(totalLeads / pageSize) ? p + 1 : p
									)
								}
								disabled={page + 1 >= Math.ceil(totalLeads / pageSize)}
							>
								Next
							</button>
						</div>
					</>
				)}
			</main>
		</div>
	);
}
