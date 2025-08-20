"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadSchema, type Lead } from "@/lib/schemas";
import { getNextLoanId, saveLead, updateLead, getLeads } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import * as Constants from "@/lib/constants";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	FormSelect,
	FormInput,
	FormPanInput,
	FormMobileInput,
	FormDateInput,
} from "./form-helpers";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NewLeadFormProps {
	lead?: Lead;
}

export function NewLeadForm({ lead }: NewLeadFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);

	const form = useForm<Lead>({
		resolver: zodResolver(LeadSchema),
		defaultValues: lead ? lead : {
			id: crypto.randomUUID(),
			loanId: "",
			dateTime: "",
			source: "",
			stage: "",
			profileType: "",
			name: "",
			gender: "",
			customerProfile: "",
			maritalStatus: "",
			panNo: "",
			mobileNo: "",
			altMobileNo: "",
			email: "",
			motherName: "",
			loanAmount: undefined,
			dsa: "",
			rcNo: "",
			vehicleVerient: "",
			mfgYear: "",
			osNo: "",
			kilometreReading: "",
			vehicleOwnerContactNo: "",
			vehicleLocation: "",
			refFirstName: "",
			refFirstMobNo: "",
			refSecondName: "",
			refSecondMobNo: "",
			nomineeName: "",
			nomineeDob: "",
			nomineeRelationship: "",
			permanentAddressType: "",
			permanentAddressLandmark: "",
			permanentAddressCategory: "",
			isCurrentAddressSame: false,
			currentAddressType: "",
			currentAddressLandmark: "",
			currentAddressCategory: "",
			isOfficeAddressSame: false,
			employmentDetail: "",
			officeAddressType: "",
			officeAddressLandmark: "",
			bankFinance: "",
			branch: "",
			loginExecutiveName: "",
			caseDealer: "",
			refNameMobNo: "",
			remarks: "",
		},
	});

	const [loanIdType, setLoanIdType] = useState<"manual" | "auto">("auto");
	// Prefill with current date & time for display; will be updated at submission

	const { watch, setValue } = form;

	const isCurrentAddressSame = watch("isCurrentAddressSame");
	const permanentAddressType = watch("permanentAddressType");
	const permanentAddressLandmark = watch("permanentAddressLandmark");
	const permanentAddressCategory = watch("permanentAddressCategory");

	const isOfficeAddressSame = watch("isOfficeAddressSame");

	useEffect(() => {
		if (!lead) {
			if (loanIdType === "auto") {
				setValue("loanId", getNextLoanId());
			}
			setValue("dateTime", new Date().toLocaleString());
		}
	}, [lead, setValue, loanIdType]);

	useEffect(() => {
		if (isCurrentAddressSame) {
			setValue("currentAddressType", permanentAddressType);
			setValue("currentAddressLandmark", permanentAddressLandmark);
			setValue("currentAddressCategory", permanentAddressCategory);
		}
	}, [
		isCurrentAddressSame,
		permanentAddressType,
		permanentAddressLandmark,
		permanentAddressCategory,
		setValue,
	]);

	useEffect(() => {
		if (isOfficeAddressSame) {
			setValue("officeAddressType", permanentAddressType);
			setValue("officeAddressLandmark", permanentAddressLandmark);
		}
	}, [
		isOfficeAddressSame,
		permanentAddressType,
		permanentAddressLandmark,
		setValue,
	]);

	const onSubmit = async (data: Lead) => {
		console.log("Lead onSubmit function called");
		console.log("Form errors:", form.formState.errors);
		console.log("Form is valid:", form.formState.isValid);
		
		setLoading(true);
		try {
			console.log("Form submission started");
			console.log("Is edit mode:", !!lead);
			console.log("Lead ID:", lead?.id);
			console.log("Form data ID:", data.id);
			
			// Set submitted date & time just before saving
			data.dateTime = new Date().toLocaleString();
			
			if (lead) {
				console.log("Calling updateLead with:", data);
				await updateLead(data);
				console.log("updateLead completed successfully");
				toast({ title: "Success", description: "Lead updated successfully." });
				router.push(`/dashboard/my-leads/${data.id}/view`);
			} else {
				console.log("Calling saveLead with:", data);
				await saveLead(data);
				console.log("saveLead completed successfully");
				toast({ title: "Success", description: "New lead created." });
				router.push("/dashboard/my-leads");
			}
		} catch (error) {
			console.error("Failed to save lead:", error);
			const message = error instanceof Error ? error.message : "Failed to save lead.";
			toast({
				variant: "destructive",
				title: "Error",
				description: message,
			});
			setLoading(false);
		}
	};

	// Helper to add 'None' as the first option for dropdowns
	const withNone = (options: { label: string; value: string }[]) => [{ label: "None", value: "none" }, ...options];

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<FormLabel className="text-black font-medium">
								LOAN ID TYPE
							</FormLabel>
							<div className="flex gap-4">
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										value="auto"
										checked={loanIdType === "auto"}
										onChange={(e) =>
											setLoanIdType(e.target.value as "manual" | "auto")
										}
										className="text-green-500 focus:ring-green-500"
									/>
									<span>Auto Generated</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										value="manual"
										checked={loanIdType === "manual"}
										onChange={(e) =>
											setLoanIdType(e.target.value as "manual" | "auto")
										}
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
										<Input
											{...field}
											readOnly={loanIdType === "auto"}
											className={`${
												loanIdType === "auto" ? "bg-gray-100" : "bg-white"
											} border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1`}
										/>
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
										<Input
											{...field}
											readOnly
											className="bg-gray-100 border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormSelect
							control={form.control}
							name="source"
							label="SOURCE"
							placeholder="Select source"
							options={withNone(Constants.SOURCES)}
						/>
						<FormSelect
							control={form.control}
							name="stage"
							label="STAGE"
							placeholder="Select stage"
							options={withNone(Constants.STAGES)}
						/>
					</div>

					{/* Profile */}
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormSelect
								control={form.control}
								name="profileType"
								label="TYPE"
								placeholder="Select type"
								options={withNone(Constants.PROFILE_TYPES)}
							/>
							<FormInput
								control={form.control}
								name="name"
								label="NAME"
								placeholder="Full Name"
								uppercase
							/>
							<FormSelect
								control={form.control}
								name="gender"
								label="GENDER"
								placeholder="Select gender"
								options={withNone(Constants.GENDERS)}
							/>
							<FormSelect
								control={form.control}
								name="customerProfile"
								label="CUSTOMER PROFILE"
								placeholder="Select profile"
								options={withNone(Constants.CUSTOMER_PROFILES)}
							/>
							<FormSelect
								control={form.control}
								name="maritalStatus"
								label="MARITAL STATUS"
								placeholder="Select status"
								options={withNone(Constants.MARITAL_STATUSES)}
							/>
							<FormPanInput
								control={form.control}
								name="panNo"
								label="PAN NO"
								placeholder="ABCDE1234F"
							/>
							<FormMobileInput
								control={form.control}
								name="mobileNo"
								label="MOBILE NO"
								placeholder="10-digit number"
							/>
							<FormMobileInput
								control={form.control}
								name="altMobileNo"
								label="ALT MOBILE NO"
								placeholder="10-digit number"
							/>
							<FormInput
								control={form.control}
								name="email"
								label="EMAIL ID"
								placeholder="example@mail.com"
								type="email"
								onChange={(e) =>
									(e.target.value = e.target.value.toLowerCase())
								}
							/>
							<FormInput
								control={form.control}
								name="motherName"
								label="MOTHER NAME"
								placeholder="Mother's Name"
								uppercase
							/>
							<FormInput
								control={form.control}
								name="loanAmount"
								label="LOAN AMOUNT"
								placeholder="Enter amount"
								type="number"
							/>
							<FormSelect
								control={form.control}
								name="dsa"
								label="DSA"
								placeholder="Select DSA"
								options={withNone(Constants.DSAS)}
							/>
						</CardContent>
					</Card>

					{/* Vehicle & Ref Contact & Nominee Information */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>Vehicle Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormInput control={form.control} name="rcNo" label="RC NO" placeholder="Vehicle RC No." uppercase />
								<FormInput control={form.control} name="vehicleVerient" label="VEHICLE / VERIENT" placeholder="e.g., Maruti Suzuki Swift VXi" />
								<FormSelect control={form.control} name="mfgYear" label="MFG YEAR" placeholder="Select year" options={withNone(Constants.MFG_YEARS)} />
								<FormSelect control={form.control} name="osNo" label="O. S NO" placeholder="Select O.S No" options={withNone(Constants.OS_NOS)} />
								<FormInput control={form.control} name="kilometreReading" label="KILOMETRE READING" placeholder="e.g., 50000" type="number" />
								<FormMobileInput control={form.control} name="vehicleOwnerContactNo" label="VEHICLE OWNER CONTACT NO" placeholder="10-digit number" />
								<FormInput control={form.control} name="vehicleLocation" label="VEHICLE LOCATION" placeholder="City or Area" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Ref Contact Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormInput control={form.control} name="refFirstName" label="FIRST NAME" placeholder="Reference 1 Name" uppercase />
								<FormMobileInput control={form.control} name="refFirstMobNo" label="FIRST MOB NO" placeholder="Reference 1 Mobile" />
								<FormInput control={form.control} name="refSecondName" label="SECOND NAME" placeholder="Reference 2 Name" uppercase />
								<FormMobileInput control={form.control} name="refSecondMobNo" label="SECOND MOB NO" placeholder="Reference 2 Mobile" />
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Nominee Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormInput control={form.control} name="nomineeName" label="NOMINEE NAME" placeholder="Nominee's full name" uppercase />
							<FormDateInput control={form.control} name="nomineeDob" label="NOMINEE Date of Birth" placeholder="DD/MM/YYYY" />
							<FormSelect control={form.control} name="nomineeRelationship" label="RELATIONSHIP" placeholder="Select relationship" options={withNone(Constants.RELATIONSHIPS)} />
						</CardContent>
					</Card>

					{/* Address Information (moved up) */}
					<Card>
						<CardHeader>
							<CardTitle>Address Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-8">
							<div>
								<h3 className="font-semibold mb-2">Permanent Address</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<FormSelect control={form.control} name="permanentAddressType" label="ADDRESS" placeholder="Select proof" options={withNone(Constants.ADDRESS_PROOFS)} />
									<FormInput control={form.control} name="permanentAddressLandmark" label="NEAR LAND MARK" placeholder="e.g., Near City Park" />
									<FormSelect control={form.control} name="permanentAddressCategory" label="CATEGORY" placeholder="Select category" options={withNone(Constants.ADDRESS_CATEGORIES)} />
								</div>
							</div>
							<div>
								<FormField
									control={form.control}
									name="isCurrentAddressSame"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<FormLabel className="font-normal">Is Current address same as Permanent Address?</FormLabel>
										</FormItem>
									)}
								/>
								{!isCurrentAddressSame && (
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-md">
										<FormSelect control={form.control} name="currentAddressType" label="ADDRESS" placeholder="Select proof" options={withNone(Constants.ADDRESS_PROOFS)} />
										<FormInput control={form.control} name="currentAddressLandmark" label="NEAR LAND MARK" placeholder="e.g., Near City Park" />
										<FormSelect control={form.control} name="currentAddressCategory" label="CATEGORY" placeholder="Select category" options={withNone(Constants.ADDRESS_CATEGORIES)} />
									</div>
								)}
							</div>
							<div>
								<h3 className="font-semibold mb-2">Office Address</h3>
								<FormField
									control={form.control}
									name="isOfficeAddressSame"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
											<FormControl>
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<FormLabel className="font-normal">Is Office address same as Permanent Address?</FormLabel>
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<FormInput control={form.control} name="employmentDetail" label="EMPLOYMENT DETAIL" placeholder="e.g., Software Engineer at XYZ" />
									{!isOfficeAddressSame && (
										<>
											<FormSelect control={form.control} name="officeAddressType" label="ADDRESS" placeholder="Select proof" options={withNone(Constants.ADDRESS_PROOFS)} />
											<FormInput control={form.control} name="officeAddressLandmark" label="NEAR LAND MARK" placeholder="e.g., Tech Park" />
										</>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Bank / Finance Information (moved after Address) */}
					<Card>
						<CardHeader>
							<CardTitle>Bank / Finance Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormSelect control={form.control} name="bankFinance" label="BANK / FINANCE" placeholder="Select Bank" options={withNone(Constants.BANKS)} />
							<FormInput control={form.control} name="branch" label="BRANCH" placeholder="Bank Branch" />
							<FormInput control={form.control} name="loginExecutiveName" label="LOGIN EXECUTIVE NAME" placeholder="Executive's Name" />
						</CardContent>
					</Card>

					{/* Dealer Information (moved after Bank/Finance) */}
					<Card>
						<CardHeader>
							<CardTitle>Dealer Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormInput control={form.control} name="caseDealer" label="CASE DEALER" placeholder="Dealer Name" />
							<FormInput control={form.control} name="refNameMobNo" label="REF NAME & MOB NO" placeholder="Reference Name & Mobile" />
						</CardContent>
					</Card>

					{/* Remarks (last section) */}
					<Card>
						<CardHeader>
							<CardTitle>Remarks</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="remarks"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1" placeholder="Add any additional remarks here..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-3">
						<Button type="button" className="bg-red-200 text-black hover:bg-red-300" variant="outline" onClick={() => router.back()}>
							Cancel
						</Button>
						<Button 
							type="button" 
							disabled={loading} 
							className="bg-black text-white hover:bg-gray-800"
							onClick={async () => {
								console.log("Lead submit button clicked");
								const isValid = await form.trigger();
								console.log("Lead form validation result:", isValid);
								console.log("Lead form errors:", form.formState.errors);
								if (isValid) {
									form.handleSubmit(onSubmit)();
								}
							}}
						>
							{loading ? (lead ? "Updating..." : "Submitting...") : lead ? "Update Lead" : "Submit Lead"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}
