"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { deleteLead } from "@/lib/data";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface LeadsTableProps {
	leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const { toast } = useToast();
    const [toDeleteId, setToDeleteId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

	if (leads.length === 0) {
		return (
			<div className="text-center p-8 border rounded-lg bg-card">
				<h3 className="text-xl font-semibold">No Leads Found</h3>
				<p className="text-muted-foreground">
					Get started by creating a new lead.
				</p>
			</div>
		);
	}

	const getBadgeVariant = (stage: string | undefined | null) => {
		if (!stage) return "outline";

		switch (stage.toLowerCase()) {
			case "disbursed":
				return "default"; // primary color
			case "sanction":
				return "secondary";
			case "rejected":
				return "destructive";
			default:
				return "outline";
		}
	};

    const onRefetch = () => {
        if (refreshing) return;
        setRefreshing(true);
        router.refresh();
        // Show spinner briefly for UX; data reload is handled by Next
        setTimeout(() => setRefreshing(false), 800);
    };

	return (
		<div className="border rounded-lg">
            <div className="flex items-center justify-end gap-2 p-2 border-b bg-white">
                <Button variant="outline" size="sm" onClick={onRefetch} disabled={refreshing} className="min-w-24">
                    {refreshing ? (
                        <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Refetching</span>
                    ) : (
                        <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refetch</span>
                    )}
                </Button>
            </div>
			<Table>
				<TableHeader className="bg-green-100" >
					<TableRow>
						<TableHead>LOAN ID</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead>MOBILE NO</TableHead>
						<TableHead>STAGE</TableHead>
						<TableHead>DATE</TableHead>
						<TableHead>BANK / FINANCE</TableHead>
						<TableHead>CASE DEALER</TableHead>
						<TableHead className="text-right">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{leads.map((lead) => (
						<TableRow
							key={lead.id}
							className="hover:bg-green-50 cursor-pointer"
							onClick={() => router.push(`/dashboard/my-leads/${lead.id}/view`)}
						>
							<TableCell className="font-semibold">{lead.loanId || "N/A"}</TableCell>
							<TableCell className="font-medium">{lead.name || "N/A"}</TableCell>
							<TableCell>{lead.mobileNo || "N/A"}</TableCell>
							<TableCell>
								<Badge variant={getBadgeVariant(lead.stage)}>
									{lead.stage || "Pending"}
								</Badge>
							</TableCell>
							<TableCell>{lead.dateTime || "N/A"}</TableCell>
							<TableCell>{lead.bankFinance || "N/A"}</TableCell>
							<TableCell>{lead.caseDealer || "N/A"}</TableCell>
							<TableCell className="text-right space-x-2">
								<Link href={`/dashboard/my-leads/${lead.id}/view`} prefetch className="text-blue-600 underline-offset-2 hover:underline border rounded px-2 py-1 text-sm" onClick={(e) => e.stopPropagation()}>View</Link>
								<Link href={`/dashboard/my-leads/${lead.id}`} prefetch className="text-sm px-2 py-1 border rounded" onClick={(e) => e.stopPropagation()}>Update</Link>
								<AlertDialog>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="rotate-90" size="icon" aria-label="More" onClick={(e) => e.stopPropagation()}>
												⋯
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<AlertDialogTrigger asChild>
												<DropdownMenuItem
													onClick={(ev) => {
														ev.stopPropagation();
														setToDeleteId(lead.id);
														toast({ variant: "destructive", title: "Delete Lead?", description: "This action cannot be undone." });
													}}
												>
													Delete
												</DropdownMenuItem>
											</AlertDialogTrigger>
										</DropdownMenuContent>
									</DropdownMenu>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This will permanently delete this lead.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={async () => {
													if (!toDeleteId) return;
													try {
														await deleteLead(toDeleteId);
														toast({ title: "Deleted", description: "Lead removed." });
														// Refresh the current route to re-fetch data and update the table
														router.refresh();
														// Optionally, you could trigger a re-fetch in parent via state
													} catch (e) {
														toast({ variant: "destructive", title: "Error", description: "Failed to delete lead." });
													} finally {
														setToDeleteId(null);
													}
												}}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
