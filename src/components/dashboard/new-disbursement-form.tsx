"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormSelect, FormInput } from "./form-helpers";

interface NewDisbursementFormProps {
  disbursement?: Disbursement;
}

export function NewDisbursementForm({ disbursement }: NewDisbursementFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loanIdType, setLoanIdType] = useState<"manual" | "auto">("auto");

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
    console.log("onSubmit function called");
    console.log("Form errors:", form.formState.errors);
    console.log("Form is valid:", form.formState.isValid);
    
    setLoading(true);
    try {
      console.log("Disbursement form submission started");
      console.log("Is edit mode:", !!disbursement);
      console.log("Disbursement ID:", disbursement?.id);
      console.log("Form data ID:", data.id);
      
      // Set submitted date & time just before saving
      data.dateTime = new Date().toLocaleString();
      
      if (disbursement) {
        console.log("Calling updateDisbursement with:", data);
        await updateDisbursement(data);
        console.log("updateDisbursement completed successfully");
        toast({ title: "Success", description: "Disbursement updated successfully." });
        router.push(`/dashboard/my-disbursements/${data.id}/view`);
      } else {
        console.log("Calling saveDisbursement with:", data);
        await saveDisbursement(data);
        console.log("saveDisbursement completed successfully");
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
            <FormInput control={form.control} name="panNo" label="PAN NO" placeholder="ABCDE1234F" onChange={(e) => (e.target.value = e.target.value.toUpperCase())} />
            <FormInput control={form.control} name="mobileNo" label="MOBILE NO" placeholder="10-digit number" type="tel" />
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
            <FormInput control={form.control} name="rcNo" label="RC NO" placeholder="Vehicle RC No." uppercase />
            <FormInput control={form.control} name="vehicleVerient" label="VEHICLE / VERIENT" placeholder="e.g., Maruti Suzuki Swift VXi" />
            <FormSelect control={form.control} name="mfgYear" label="MFG YEAR" placeholder="Select year" options={Constants.MFG_YEARS} />
            <FormSelect control={form.control} name="osNo" label="O. S NO" placeholder="Select O.S No" options={Constants.OS_NOS} />
            <FormInput control={form.control} name="vehicleOwnerContactNo" label="VEHICLE OWNER CONTACT NO" placeholder="10-digit number" type="tel" />
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
            <FormInput control={form.control} name="dealerMob" label="DEALER MOB" placeholder="10-digit number" type="tel" />
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
          <Button type="button" className="bg-red-200 text-black hover:bg-red-300" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={loading} 
            className="bg-black text-white hover:bg-gray-800"
            onClick={async () => {
              console.log("Submit button clicked");
              const isValid = await form.trigger();
              console.log("Form validation result:", isValid);
              console.log("Form errors:", form.formState.errors);
              console.log("Detailed errors:", JSON.stringify(form.formState.errors, null, 2));
              
              // Show specific field errors
              Object.keys(form.formState.errors).forEach(field => {
                console.log(`Error in field "${field}":`, (form.formState.errors as any)[field]);
              });
              
              if (isValid) {
                form.handleSubmit(onSubmit)();
              } else {
                console.log("Form validation failed - not submitting");
              }
            }}
          >
            {loading ? (disbursement ? "Updating..." : "Submitting...") : (disbursement ? "Update Disbursement" : "Submit Disbursement")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
