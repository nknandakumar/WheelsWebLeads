import React from "react";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import {Button} from "@/components/ui/button"
interface LeadsTableProps {
	leads: Lead[];
}

const MemoizedTableRow = React.memo(function TableRowMemo({
	lead,
	onViewEdit,
}: {
	lead: Lead;
	onViewEdit: (id: string) => void;
}) {
	const getBadgeVariant = (stage: string) => {
		switch (stage.toLowerCase()) {
			case "disbursed":
				return "default";
			case "sanction":
				return "secondary";
			case "rejected":
				return "destructive";
			default:
				return "outline";
		}
	};
	return (
		<TableRow key={lead.id}>
			<TableCell>{lead.dateTime}</TableCell>
			<TableCell>{lead.loanId}</TableCell>
			<TableCell className="font-medium">{lead.name}</TableCell>
			<TableCell>{lead.mobileNo}</TableCell>
			<TableCell>
				{new Intl.NumberFormat("en-IN", {
					style: "currency",
					currency: "INR",
				}).format(lead.loanAmount)}
			</TableCell>
			<TableCell>
				<Badge variant={getBadgeVariant(lead.stage)}>{lead.stage}</Badge>
			</TableCell>
			<TableCell className="text-right">
				<Button variant="outline" size="sm" onClick={() => onViewEdit(lead.id)}>
					View/Edit
				</Button>
			</TableCell>
		</TableRow>
	);
});

export function LeadsTable({ leads }: LeadsTableProps) {
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

	const handleViewEdit = React.useCallback(
		(id: string) => {
			router.push(`/dashboard/my-leads/${id}`);
		},
		[router]
	);

	return (
		<div className="border rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date & Time</TableHead>
						<TableHead>Loan ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Mobile No</TableHead>
						<TableHead>Loan Amount</TableHead>
						<TableHead>Stage</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{leads.map((lead) => (
						<MemoizedTableRow
							key={lead.id}
							lead={lead}
							onViewEdit={handleViewEdit}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
