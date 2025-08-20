"use client";

import { useEffect, useState, use as usePromise } from "react";
import { getLeadById } from "@/lib/data";
import { type Lead } from "@/lib/schemas";
import { NewLeadForm } from "@/components/dashboard/new-lead-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = usePromise(params);
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                setLoading(true);
                const leadData = await getLeadById(id);
                if (leadData) {
                    setLead(leadData);
                } else {
                    setError("Lead not found.");
                }
            } catch (error) {
                console.error("Error fetching lead:", error);
                setError("Failed to load lead.");
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    if (loading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-10 w-1/4" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-destructive">{error}</div>;
    }

    return (
        <div className="flex flex-col h-full p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Edit Lead</h1>
                <p className="text-muted-foreground">Editing lead for: {lead?.name}</p>
            </header>
            <main className="flex-1">{lead && <NewLeadForm lead={lead} />}</main>
        </div>
    );
}
