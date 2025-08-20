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
import type { Disbursement } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { deleteDisbursement } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DisbursementsTableProps {
  disbursements: Disbursement[];
}

export function DisbursementsTable({ disbursements }: DisbursementsTableProps) {
  const { toast } = useToast();
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const router = useRouter();

  if (disbursements.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card">
        <h3 className="text-xl font-semibold">No Disbursements Found</h3>
        <p className="text-muted-foreground">Get started by creating a new disbursement.</p>
      </div>
    );
  }
  
  const getBadgeVariant = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'disbursed':
        return 'default';
      case 'cancellation':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader className="bg-green-100 hover:bg-green-100" >
          <TableRow>
            <TableHead>LOAN ID</TableHead>
            <TableHead>RC NO</TableHead>
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
          {disbursements.map((d) => (
            <TableRow
              key={d.id}
              className="hover:bg-green-50 cursor-pointer"
              onClick={() => router.push(`/dashboard/my-disbursements/${d.id}/view`)}
            >
              <TableCell className="font-semibold">{d.loanId || "N/A"}</TableCell>
              <TableCell>{d.rcNo || "N/A"}</TableCell>
              <TableCell className="font-medium">{d.name || "N/A"}</TableCell>
              <TableCell>{d.mobileNo || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(d.stage)}>{d.stage}</Badge>
              </TableCell>
              <TableCell>{d.dateTime || "N/A"}</TableCell>
              <TableCell>{d.bankFinance || "N/A"}</TableCell>
              <TableCell>{d.caseDealer || "N/A"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/dashboard/my-disbursements/${d.id}/view`} prefetch className="text-blue-600 underline-offset-2 hover:underline text-sm" onClick={(e) => e.stopPropagation()}>View</Link>
                <Link href={`/dashboard/my-disbursements/${d.id}`} prefetch className="text-sm px-2 py-1 border rounded" onClick={(e) => e.stopPropagation()}>Update</Link>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More" onClick={(e) => e.stopPropagation()}>⋯</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setToDeleteId(d.id);
                            toast({ variant: "destructive", title: "Delete Disbursement?", description: "This action cannot be undone." });
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
                        This will permanently delete this disbursement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (!toDeleteId) return;
                          try {
                            await deleteDisbursement(toDeleteId);
                            toast({ title: "Deleted", description: "Disbursement removed." });
                            // Optionally re-fetch in parent via state
                          } catch (e) {
                            toast({ variant: "destructive", title: "Error", description: "Failed to delete disbursement." });
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
