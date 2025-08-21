"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DisbursementSchema, type Disbursement } from "@/lib/schemas";
import { getNextLoanId, saveDisbursement, updateDisbursement } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import * as Constants from "@/lib/constants";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormSelect, FormInput, FormPanInput, FormMobileInput, FormRcInput } from "./form-helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NewDisbursementFormProps {
  disbursement?: Disbursement;
}

export function NewDisbursementForm({ disbursement }: NewDisbursementFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loanIdType, setLoanIdType] = useState<"manual" | "auto">("auto");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorItems, setErrorItems] = useState<string[]>([]);

  const form = useForm<Disbursement>({
    resolver: zodResolver(DisbursementSchema),
    defaultValues: disbursement ? disbursement : {
      id: crypto.randomUUID(),
      loanId: "",
      dateTime: "",
      source: "",
      stage: "",
      profileType: "",
      name: "",
      gender: "",
      customerProfile: "",
      panNo: "",
      mobileNo: "",
      altMobileNo: "",
      email: "",
      dsa: "",
      bankFinance: "",
      bankFinanceBranch: "",
      loginExecutiveName: "",
      rcNo: "",
      vehicleVerient: "",
      mfgYear: "",
      osNo: "",
      kilometreReading: "",
      vehicleOwnerContactNo: "",
      totalLoanAmount: undefined,
      pfCharges: undefined,
      documentationCharges: undefined,
      loanInsuranceCharges: undefined,
      otherCharges: undefined,
      rtoCharges: undefined,
      netLoanAmount: 0,
      tenure: "",
      irr: "",
      emiAmount: "",
      emiDate: "",
      transaction1: undefined,
      transaction2: undefined,
      remarksForHold: "",
      utr: "",
      caseDealer: "",
      dealerMob: "",
      rcCardStatus: "",
      remarks: "",
    },
  });

  const { watch, setValue } = form;

  const totalLoanAmount = watch("totalLoanAmount");
  const pfCharges = watch("pfCharges");
  const documentationCharges = watch("documentationCharges");
  const loanInsuranceCharges = watch("loanInsuranceCharges");
  const otherCharges = watch("otherCharges");
  const rtoCharges = watch("rtoCharges");

  useEffect(() => {
    if (!disbursement) {
      if (loanIdType === "auto") {
        setValue("loanId", getNextLoanId());
      }
      // Prefill display with current date & time; will be updated at submission
      setValue("dateTime", new Date().toLocaleString());
    }
  }, [disbursement, setValue, loanIdType]);

  useEffect(() => {
    const net = (totalLoanAmount || 0) - (pfCharges || 0) - (documentationCharges || 0) - (loanInsuranceCharges || 0) - (otherCharges || 0) - (rtoCharges || 0);
    setValue("netLoanAmount", net);
  }, [totalLoanAmount, pfCharges, documentationCharges, loanInsuranceCharges, otherCharges, rtoCharges, setValue]);

  const onSubmit = async (data: Disbursement) => {
    setLoading(true);
    try {
      // Set submitted date & time just before saving
      data.dateTime = new Date().toLocaleString();
      
      if (disbursement) {
        await updateDisbursement(data);
        toast({ title: "Success", description: "Disbursement updated successfully." });
        router.push(`/dashboard/my-disbursements/${data.id}/view`);
      } else {
        await saveDisbursement(data);
        toast({ title: "Success", description: "New disbursement created." });
        router.push("/dashboard/my-disbursements");
      }
    } catch (error) {
      console.error("Failed to save disbursement:", error);
      const message = error instanceof Error ? error.message : "Failed to save disbursement.";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      setLoading(false);
    }
  };

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    
    
        {/* Step 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <FormLabel>LOAN ID TYPE</FormLabel>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="auto"
                    checked={loanIdType === "auto"}
                    onChange={(e) => setLoanIdType(e.target.value as "manual" | "auto")}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span>Auto Generated</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="manual"
                    checked={loanIdType === "manual"}
                    onChange={(e) => setLoanIdType(e.target.value as "manual" | "auto")}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span>Manual</span>
                </label>
              </div>
            </div>
            <FormField
              control={form.control}
              name="loanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LOAN ID</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={loanIdType === "auto"} className={loanIdType === "auto" ? "bg-muted" : ""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DATE & TIME</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormSelect control={form.control} name="source" label="SOURCE" placeholder="Select source" options={Constants.SOURCES} />
            <FormSelect control={form.control} name="stage" label="STAGE" placeholder="Select stage" options={Constants.DISBURSEMENT_STAGES} />
          </CardContent>
        </Card>

        {/* Step 2: Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect control={form.control} name="profileType" label="TYPE" placeholder="Select type" options={Constants.PROFILE_TYPES} />
            <FormInput control={form.control} name="name" label="NAME" placeholder="Full Name" uppercase />
            <FormSelect control={form.control} name="gender" label="GENDER" placeholder="Select gender" options={Constants.GENDERS} />
            <FormSelect control={form.control} name="customerProfile" label="CUSTOMER PROFILE" placeholder="Select profile" options={Constants.CUSTOMER_PROFILES} />
            <FormPanInput control={form.control} name="panNo" label="PAN NO" placeholder="10 characters" />
            <FormMobileInput control={form.control} name="mobileNo" label="MOBILE NO" placeholder="10-digit number" />
            <FormInput control={form.control} name="email" label="EMAIL ID" placeholder="example@mail.com" type="email" onChange={(e) => (e.target.value = e.target.value.toLowerCase())} />
            <FormSelect control={form.control} name="dsa" label="DSA" placeholder="Select DSA" options={Constants.DSAS} />
          </CardContent>
        </Card>

        {/* Step 3: Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormRcInput control={form.control} name="rcNo" label="RC NO" placeholder="Vehicle RC No." />
            <FormInput control={form.control} name="vehicleVerient" label="VEHICLE / VERIENT" placeholder="e.g., Maruti Suzuki Swift VXi" />
            <FormSelect control={form.control} name="mfgYear" label="MFG YEAR" placeholder="Select year" options={Constants.MFG_YEARS} />
            <FormSelect control={form.control} name="osNo" label="O. S NO" placeholder="Select O.S No" options={Constants.OS_NOS} />
            <FormMobileInput control={form.control} name="vehicleOwnerContactNo" label="VEHICLE OWNER CONTACT NO" placeholder="10-digit number" />
          </CardContent>
        </Card>

        {/* Step 4: Bank / Finance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bank / Finance Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect control={form.control} name="bankFinance" label="BANK / FINANCE" placeholder="Select Bank" options={Constants.BANKS} />
            <FormInput control={form.control} name="bankFinanceBranch" label="BANK / FINANCE BRANCH" placeholder="Branch name" uppercase />
            <FormInput control={form.control} name="loginExecutiveName" label="LOAN EXECUTIVE NAME" placeholder="Executive's name" uppercase />
          </CardContent>
        </Card>

        {/* Step 5: Dealer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Dealer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput control={form.control} name="caseDealer" label="CASE DEALER" placeholder="Dealer Name" uppercase />
            <FormMobileInput control={form.control} name="dealerMob" label="DEALER MOB" placeholder="10-digit number" />
            <FormField
              control={form.control}
              name="remarksForHold"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>REMARKS</FormLabel>
                  <FormControl>
                    <Textarea className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white" placeholder="Add dealer remarks..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Step 6: Disbursement Details */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput control={form.control} name="totalLoanAmount" label="TOTAL LOAN AMOUNT" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="pfCharges" label="P.F CHARGES (%)" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="documentationCharges" label="DOCUMENTATION CHARGES" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="loanInsuranceCharges" label="LOAN INSURANCE CHARGES" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="otherCharges" label="OTHER CHARGES" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="rtoCharges" label="RTO CHARGES" placeholder="0.00" type="number" />
            <FormField
              control={form.control}
              name="netLoanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NET LOAN AMOUNT</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white" readOnly  />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Break-up Information (merged) */}
            <FormSelect control={form.control} name="tenure" label="TENURE" placeholder="Months" options={Constants.TENURES} />
            <FormInput control={form.control} name="irr" label="IRR" placeholder="e.g., 12.5%" />
            <FormInput control={form.control} name="emiAmount" label="EMI AMOUNT" placeholder="0.00" type="number" />
            <FormSelect control={form.control} name="emiDate" label="EMI DATE" placeholder="Select Date" options={Constants.EMI_DATES} />

            {/* Payment Details (merged) */}
            <FormInput control={form.control} name="transaction1" label="TRANSACTION 1" placeholder="0.00" type="number" />
            <FormInput control={form.control} name="transaction2" label="TRANSACTION 2" placeholder="0.00" type="number" />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>REMARKS FOR HOLD</FormLabel>
                  <FormControl>
                    <Textarea className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="utr"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>UTR</FormLabel>
                  <FormControl>
                    <Textarea className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white" placeholder="UTR details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Final Details (merged) */}
            <FormSelect control={form.control} name="rcCardStatus" label="RC CARD STATUS" placeholder="Select status" options={Constants.RC_CARD_STATUSES} />

          </CardContent>
        </Card>

        {/* Step 7: Form Submission */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard" prefetch className="inline-flex items-center justify-center rounded-md border px-4 py-2 bg-red-200 text-black hover:bg-red-300">
            Cancel
          </Link>
          <Button 
            type="button" 
            disabled={loading} 
            className="bg-black text-white hover:bg-gray-800 min-w-56"
            onClick={async () => {
              const isValid = await form.trigger();
              if (isValid) {
                form.handleSubmit(onSubmit)();
              } else {
                const errs = Object.entries(form.formState.errors)
                  .map(([k, v]: any) => v?.message || `${k} is invalid`)
                  .filter(Boolean)
                  .slice(0, 10);
                setErrorItems(errs.length ? errs : ["Please correct the highlighted fields."]);
                setErrorOpen(true);
              }
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {disbursement ? "Updating..." : "Submitting..."}
              </span>
            ) : (
              disbursement ? "Update Disbursement" : "Submit Disbursement"
            )}
          </Button>
        </div>
      </form>
    </Form>

    <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Form validation failed</AlertDialogTitle>
          <AlertDialogDescription>
            <ul className="list-disc pl-5 space-y-1">
              {errorItems.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
