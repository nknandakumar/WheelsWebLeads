import { z } from "zod";

const requiredString = (message: string) => z.string().min(1, { message });

export const LeadSchema = z.object({
  id: z.string(),
  loanId: z.string(),
  dateTime: z.string(),
  source: requiredString("Source is required"),
  stage: requiredString("Stage is required"),
  
  // Profile
  profileType: requiredString("Type is required"),
  name: requiredString("Name is required"),
  gender: requiredString("Gender is required"),
  customerProfile: requiredString("Customer profile is required"),
  maritalStatus: requiredString("Marital status is required"),
  panNo: requiredString("PAN No. is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  mobileNo: requiredString("Mobile No. is required").regex(/^\d{10}$/, "Must be 10 digits"),
  altMobileNo: z.string().optional(),
  email: requiredString("Email is required").email(),
  motherName: z.string().optional(),
  loanAmount: z.preprocess((a) => typeof a === 'number' ? a : parseInt(String(a) || '', 10), 
    z.number({ required_error: "Loan amount is required" }).positive("Must be a positive number")),
  dsa: requiredString("DSA is required"),

  // Vehicle Information
  rcNo: requiredString("RC No. is required"),
  vehicleVerient: requiredString("Vehicle/Verient is required"),
  mfgYear: requiredString("MFG Year is required"),
  osNo: requiredString("O.S No. is required"),
  kilometreReading: z.string().optional(),
  vehicleOwnerContactNo: requiredString("Vehicle owner contact no. is required"),
  vehicleLocation: z.string().optional(),

  // Ref Contact Information
  refFirstName: z.string().optional(),
  refFirstMobNo: z.string().optional(),
  refSecondName: z.string().optional(),
  refSecondMobNo: z.string().optional(),

  // Nominee Information
  nomineeName: z.string().optional(),
  nomineeDob: z.string().optional(),
  nomineeRelationship: z.string().optional(),

  // Permanent Address
  permanentAddressType: requiredString("Address type is required"),
  permanentAddressLandmark: requiredString("Near landmark is required"),
  permanentAddressCategory: requiredString("Category is required"),

  // Current Address
  isCurrentAddressSame: z.boolean(),
  currentAddressType: z.string().optional(),
  currentAddressLandmark: z.string().optional(),
  currentAddressCategory: z.string().optional(),

  // Office Address
  isOfficeAddressSame: z.boolean(),
  employmentDetail: requiredString("Employment detail is required"),
  officeAddressType: z.string().optional(),
  officeAddressLandmark: z.string().optional(),
  
  // Bank / Finance Information
  bankFinance: z.string().optional(),
  branch: z.string().optional(),
  loginExecutiveName: z.string().optional(),

  // Dealer Information
  caseDealer: requiredString("Case dealer is required"),
  refNameMobNo: z.string().optional(),

  remarks: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.isCurrentAddressSame) {
    if (!data.currentAddressType) {
      ctx.addIssue({ code: "custom", message: "Address type is required", path: ["currentAddressType"] });
    }
    if (!data.currentAddressLandmark) {
      ctx.addIssue({ code: "custom", message: "Near landmark is required", path: ["currentAddressLandmark"] });
    }
    if (!data.currentAddressCategory) {
      ctx.addIssue({ code: "custom", message: "Category is required", path: ["currentAddressCategory"] });
    }
  }
  if (!data.isOfficeAddressSame) {
    if (!data.officeAddressType) {
      ctx.addIssue({ code: "custom", message: "Address type is required", path: ["officeAddressType"] });
    }
     if (!data.officeAddressLandmark) {
      ctx.addIssue({ code: "custom", message: "Near landmark is required", path: ["officeAddressLandmark"] });
    }
  }
});

export type Lead = z.infer<typeof LeadSchema>;


export const DisbursementSchema = z.object({
  id: z.string(),
  loanId: z.string(),
  dateTime: z.string(),
  source: requiredString("Source is required"),
  stage: requiredString("Stage is required"),

  // Profile
  profileType: requiredString("Type is required"),
  name: requiredString("Name is required"),
  gender: requiredString("Gender is required"),
  customerProfile: requiredString("Customer profile is required"),
  panNo: requiredString("PAN No. is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  mobileNo: requiredString("Mobile no. is required").regex(/^\d{10}$/, "Must be 10 digits"),
  altMobileNo: z.string().optional(),
  email: requiredString("Email is required").email(),
  dsa: requiredString("DSA is required"),
  bankFinance: requiredString("Bank/Finance is required"),
  bankFinanceBranch: requiredString("Bank/Finance branch is required"),
  loginExecutiveName: requiredString("Login executive name is required"),

  // Vehicle Information
  rcNo: requiredString("RC No. is required"),
  vehicleVerient: requiredString("Vehicle/Verient is required"),
  mfgYear: requiredString("MFG Year is required"),
  osNo: requiredString("O.S No. is required"),
  kilometreReading: z.string().optional(),
  vehicleOwnerContactNo: requiredString("Vehicle owner contact no. is required"),

  // Loan Information
  totalLoanAmount: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number({ required_error: "Total loan amount is required" }).positive()),
  pfCharges: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  documentationCharges: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  loanInsuranceCharges: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  otherCharges: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  rtoCharges: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  netLoanAmount: z.number(),

  // Break-up Information
  tenure: requiredString("Tenure is required"),
  irr: z.string().optional(),
  emiAmount: z.string().optional(),
  emiDate: requiredString("EMI Date is required"),

  // Payment Details
  transaction1: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number({ required_error: "Transaction 1 is required" }).nonnegative()),
  transaction2: z.preprocess((a) => typeof a === 'number' ? a : parseFloat(String(a) || ''), z.number().nonnegative().optional()),
  remarksForHold: z.string().optional(),
  utr: z.string().optional(),

  // Dealer Details
  caseDealer: requiredString("Case dealer is required"),
  dealerMob: z.string().optional(),
  
  rcCardStatus: requiredString("RC Card Status is required"),
  remarks: z.string().optional(),
});

export type Disbursement = z.infer<typeof DisbursementSchema>;
