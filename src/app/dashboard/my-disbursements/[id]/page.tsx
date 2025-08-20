"use client";

import { useEffect, useState, use as usePromise } from "react";
import { getDisbursementById } from "@/lib/data";
import { type Disbursement } from "@/lib/schemas";
import { NewDisbursementForm } from "@/components/dashboard/new-disbursement-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditDisbursementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [disbursement, setDisbursement] = useState<Disbursement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisbursement = async () => {
      try {
        setLoading(true);
        const data = await getDisbursementById(id);
        if (data) {
          setDisbursement(data);
        } else {
          setError("Disbursement not found.");
        }
      } catch (e) {
        console.error("Error fetching disbursement:", e);
        setError("Failed to load disbursement.");
      } finally {
        setLoading(false);
      }
    };
    fetchDisbursement();
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
        <h1 className="text-2xl font-bold">Edit Disbursement</h1>
        <p className="text-muted-foreground">Editing disbursement for: {disbursement?.name}</p>
      </header>
      <main className="flex-1">
        {disbursement && <NewDisbursementForm disbursement={disbursement} />}
      </main>
    </div>
  );
}
