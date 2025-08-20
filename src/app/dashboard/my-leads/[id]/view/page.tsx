"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getLeadById } from "@/lib/data";
import type { Lead } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ViewLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = usePromise(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getLeadById(id);
        if (data) setLead(data);
        else setError("Lead not found.");
      } catch (e) {
        console.error(e);
        setError("Failed to load lead.");
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

  if (!lead) return null;

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
            onClick={() => router.push("/dashboard/my-leads")}
            className="print:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>

        </div>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className=" text-center text-3xl font-semibold underline" >Wheels Web</h1>
          <h2 className="text-gray-600 text-center" >Used car loans</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lead Details</h1>
            <p className="text-muted-foreground">{lead.name} — {lead.loanId}</p>
          </div>
          <div className="space-x-2 print:hidden">
            <Button variant="outline" onClick={() => router.push(`/dashboard/my-leads/${lead.id}`)}>Edit</Button>
            <Button onClick={onPrint}>Print</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Loan ID" value={lead.loanId} />
              <Field label="Date & Time" value={lead.dateTime} />
              <Field label="Stage" value={lead.stage} />
              <Field label="Source" value={lead.source} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Type" value={lead.profileType} />
              <Field label="Name" value={lead.name} />
              <Field label="Gender" value={lead.gender} />
              <Field label="Customer Profile" value={lead.customerProfile} />
              <Field label="Marital Status" value={lead.maritalStatus} />
              <Field label="PAN No" value={lead.panNo} />
              <Field label="Mobile No" value={lead.mobileNo} />
              <Field label="Alt Mobile No" value={lead.altMobileNo} />
              <Field label="Email" value={lead.email} />
              <Field label="Mother Name" value={lead.motherName} />
              <Field label="Loan Amount" value={lead.loanAmount} />
              <Field label="DSA" value={lead.dsa} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="RC No" value={lead.rcNo} />
              <Field label="Vehicle / Verient" value={lead.vehicleVerient} />
              <Field label="MFG Year" value={lead.mfgYear} />
              <Field label="O.S No" value={lead.osNo} />
              <Field label="Kilometre Reading" value={lead.kilometreReading} />
              <Field label="Owner Contact No" value={lead.vehicleOwnerContactNo} />
              <Field label="Vehicle Location" value={lead.vehicleLocation} />
            </div>
          </CardContent>
        </Card>

        {/* Addresses moved after Nominee as per requested flow */}

        {/* Bank / Finance moved after Addresses as per requested flow */}


        {/* References (visible on print) */}
        <Card>
          <CardHeader>
            <CardTitle>References Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ref 1 Name" value={lead.refFirstName} />
              <Field label="Ref 1 Mobile" value={lead.refFirstMobNo} />
              <Field label="Ref 2 Name" value={lead.refSecondName} />
              <Field label="Ref 2 Mobile" value={lead.refSecondMobNo} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nominee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Nominee Name" value={lead.nomineeName} />
              <Field label="Nominee DOB" value={lead.nomineeDob} />
              <Field label="Relationship" value={lead.nomineeRelationship} />
            </div>
          </CardContent>
        </Card>

        {/* Addresses (now after Nominee) */}
        <Card>
          <CardHeader>
            <CardTitle>Addresses Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Permanent Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Address Proof" value={lead.permanentAddressType} />
                  <Field label="Near Landmark" value={lead.permanentAddressLandmark} />
                  <Field label="Category" value={lead.permanentAddressCategory} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Current Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Same as Permanent" value={lead.isCurrentAddressSame ? "Yes" : "No"} />
                  {!lead.isCurrentAddressSame && (
                    <>
                      <Field label="Address Proof" value={lead.currentAddressType} />
                      <Field label="Near Landmark" value={lead.currentAddressLandmark} />
                      <Field label="Category" value={lead.currentAddressCategory} />
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Office</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Employment Detail" value={lead.employmentDetail} />
                  <Field label="Same as Permanent" value={lead.isOfficeAddressSame ? "Yes" : "No"} />
                  {!lead.isOfficeAddressSame && (
                    <>
                      <Field label="Address Proof" value={lead.officeAddressType} />
                      <Field label="Near Landmark" value={lead.officeAddressLandmark} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank / Finance (now after Addresses) */}
        <Card>
          <CardHeader>
            <CardTitle>Bank / Finance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Bank / Finance" value={lead.bankFinance} />
              <Field label="Branch" value={lead.branch} />
              <Field label="Login Executive" value={lead.loginExecutiveName} />
            </div>
          </CardContent>
        </Card>

        {/* Dealer Information (hidden on print) */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Case Dealer" value={lead.caseDealer} />
              <Field label="Ref Name & Mob No" value={lead.refNameMobNo} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Remarks" value={lead.remarks} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
