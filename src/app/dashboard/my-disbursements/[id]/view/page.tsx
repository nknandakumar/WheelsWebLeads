"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getDisbursementById } from "@/lib/data";
import type { Disbursement } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ViewDisbursementPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = usePromise(params);
  const [disbursement, setDisbursement] = useState<Disbursement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDisbursementById(id);
        if (data) setDisbursement(data);
        else setError("Disbursement not found.");
      } catch (e) {
        console.error(e);
        setError("Failed to load disbursement.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onPrint = () => {
    window.print();
  };

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

  if (!disbursement) return null;

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 break-words">
        {value ? String(value) : "-"}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6">
      <header className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/my-disbursements")}
            className="print:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Disbursements
          </Button>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className=" text-center text-3xl font-semibold underline " >Wheels Web</h1>
          <h2 className="text-gray-600 text-center" >Used car loans</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Disbursement Details</h1>
            <p className="text-muted-foreground">{disbursement.name} — {disbursement.loanId}</p>
          </div>
          <div className="space-x-2 print:hidden">
            <Button variant="outline" onClick={() => router.push(`/dashboard/my-disbursements/${disbursement.id}`)}>Edit</Button>
            <Button onClick={onPrint}>Print</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-8">
        {/* Step 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4 print:hidden">
              <div className="text-xs text-muted-foreground mb-1">LOAN ID TYPE</div>
              <div className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                Auto Generated
              </div>
            </div>
            <Field label="LOAN ID" value={disbursement.loanId} />
            <Field label="DATE & TIME" value={disbursement.dateTime} />
            <Field label="SOURCE" value={disbursement.source} />
            <Field label="STAGE" value={disbursement.stage} />
          </CardContent>
        </Card>

        {/* Step 2: Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="TYPE" value={disbursement.profileType} />
            <Field label="NAME" value={disbursement.name} />
            <Field label="GENDER" value={disbursement.gender} />
            <Field label="CUSTOMER PROFILE" value={disbursement.customerProfile} />
            <Field label="PAN NO" value={disbursement.panNo} />
            <Field label="MOBILE NO" value={disbursement.mobileNo} />
            <Field label="EMAIL ID" value={disbursement.email} />
            <Field label="DSA" value={disbursement.dsa} />
          </CardContent>
        </Card>

        {/* Step 3: Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="RC NO" value={disbursement.rcNo} />
            <Field label="VEHICLE / VERIENT" value={disbursement.vehicleVerient} />
            <Field label="MFG YEAR" value={disbursement.mfgYear} />
            <Field label="O. S NO" value={disbursement.osNo} />
            <Field label="VEHICLE OWNER CONTACT NO" value={disbursement.vehicleOwnerContactNo} />
          </CardContent>
        </Card>

        {/* Step 4: Bank / Finance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bank / Finance Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="BANK / FINANCE" value={disbursement.bankFinance} />
            <Field label="BANK / FINANCE BRANCH" value={disbursement.bankFinanceBranch} />
            <Field label="LOAN EXECUTIVE NAME" value={disbursement.loginExecutiveName} />
          </CardContent>
        </Card>

        {/* Step 5: Dealer Information */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="CASE DEALER" value={disbursement.caseDealer} />
            <Field label="DEALER MOB" value={disbursement.dealerMob} />
            <div className="md:col-span-3">
              <Field label="REMARKS" value={disbursement.remarksForHold} />
            </div>
          </CardContent>
        </Card>

        {/* Step 6: Disbursement Details */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="TOTAL LOAN AMOUNT" value={disbursement.totalLoanAmount} />
            <Field label="P.F CHARGES (%)" value={disbursement.pfCharges} />
            <Field label="DOCUMENTATION CHARGES" value={disbursement.documentationCharges} />
            <Field label="LOAN INSURANCE CHARGES" value={disbursement.loanInsuranceCharges} />
            <Field label="OTHER CHARGES" value={disbursement.otherCharges} />
            <Field label="RTO CHARGES" value={disbursement.rtoCharges} />
            <Field label="NET LOAN AMOUNT" value={disbursement.netLoanAmount} />
            
            <Field label="TENURE" value={disbursement.tenure} />
            <Field label="IRR" value={disbursement.irr} />
            <Field label="EMI AMOUNT" value={disbursement.emiAmount} />
            <Field label="EMI DATE" value={disbursement.emiDate} />
            
            <Field label="TRANSACTION 1" value={disbursement.transaction1} />
            <Field label="TRANSACTION 2" value={disbursement.transaction2} />
            <div className="md:col-span-3">
              <Field label="REMARKS FOR HOLD" value={disbursement.remarks} />
            </div>
            <div className="md:col-span-3">
              <Field label="UTR" value={disbursement.utr} />
            </div>
            
            <Field label="RC CARD STATUS" value={disbursement.rcCardStatus} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
