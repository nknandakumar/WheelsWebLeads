"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getDisbursements, getDisbursementsCount } from "@/lib/data";
import type { Disbursement } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DisbursementsTable = dynamic(
  () => import("@/components/dashboard/disbursements-table").then(m => m.DisbursementsTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

export default function MyDisbursementsPage() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [totalDisbursements, setTotalDisbursements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [data, total] = await Promise.all([
          getDisbursements(page * pageSize, pageSize),
          getDisbursementsCount(),
        ]);
        setDisbursements(data);
        setTotalDisbursements(total);
      } catch (e) {
        console.error("Error fetching disbursements:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const filteredDisbursements = useMemo(() => {
    const base = !searchTerm
      ? disbursements
      : disbursements.filter(d =>
          Object.values(d).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
    return [...base].sort((a, b) => {
      const ta = a.dateTime ? Date.parse(a.dateTime) : 0;
      const tb = b.dateTime ? Date.parse(b.dateTime) : 0;
      return tb - ta;
    });
  }, [disbursements, searchTerm]);

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
        <div className="flex md:flex-row flex-col gap-4 justify-between items-center">
          <h1 className="text-2xl font-bold">My Disbursements</h1>
          <div className="w-full max-w-sm">
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
          <p>Loading disbursements...</p>
        ) : (
          <>
            <DisbursementsTable disbursements={filteredDisbursements} />
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
              <span>Page {page + 1} of {Math.ceil(totalDisbursements / pageSize)}</span>
              <button onClick={() => setPage((p) => (p + 1 < Math.ceil(totalDisbursements / pageSize) ? p + 1 : p))} disabled={page + 1 >= Math.ceil(totalDisbursements / pageSize)}>Next</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
