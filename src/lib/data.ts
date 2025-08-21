"use client";

import type { Lead, Disbursement } from "./schemas";

// Temporary in-browser storage (localStorage) for testing/approval
const LS_LEADS_KEY = "app:leads";
const LS_DISBURSEMENTS_KEY = "app:disbursements";

function readArray<T>(key: string): T[] {
    if (typeof window === "undefined" || !window.localStorage) return [];
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
        return [];
    }
}

function writeArray<T>(key: string, value: T[]): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
}

// --- Demo data seeding ---
function seedDemoData() {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
        const leads = readArray<Lead>(LS_LEADS_KEY);
        const disb = readArray<Disbursement>(LS_DISBURSEMENTS_KEY);
        if (leads.length === 0) {
            const now = new Date().toLocaleString();
            const sampleLeads: Lead[] = [
                {
                    id: crypto.randomUUID(),
                    loanId: `2025${(1).toString().padStart(5, "0")}`,
                    dateTime: now,
                    source: "referral",
                    stage: "new",
                    profileType: "individual",
                    name: "Ravi Kumar",
                    gender: "male",
                    customerProfile: "salaried",
                    maritalStatus: "single",
                    panNo: "ABCDE1234F",
                    mobileNo: "9876543210",
                    altMobileNo: "9876501234",
                    email: "ravi@example.com",
                    motherName: "Sita",
                    loanAmount: 500000,
                    dsa: "none",
                    rcNo: "TN09AB1234",
                    vehicleVerient: "Maruti Swift VXi",
                    mfgYear: "2022",
                    osNo: "os_01",
                    kilometreReading: "25000",
                    vehicleOwnerContactNo: "9123456789",
                    vehicleLocation: "Chennai",
                    refFirstName: "Karthik",
                    refFirstMobNo: "9000000001",
                    refSecondName: "Vishal",
                    refSecondMobNo: "9000000002",
                    nomineeName: "Anita",
                    nomineeDob: "01/01/1995",
                    nomineeRelationship: "spouse",
                    permanentAddressType: "aadhaar",
                    permanentAddressLandmark: "Near City Park",
                    permanentAddressCategory: "own",
                    isCurrentAddressSame: true,
                    currentAddressType: "",
                    currentAddressLandmark: "",
                    currentAddressCategory: "",
                    isOfficeAddressSame: true,
                    employmentDetail: "Engineer at ABC Corp",
                    officeAddressType: "",
                    officeAddressLandmark: "",
                    bankFinance: "HDFC",
                    branch: "T Nagar",
                    loginExecutiveName: "Meera",
                    caseDealer: "Wheels Auto",
                    refNameMobNo: "Ramesh - 9000090000",
                    remarks: "Priority customer",
                },
                {
                    id: crypto.randomUUID(),
                    loanId: `2025${(2).toString().padStart(5, "0")}`,
                    dateTime: now,
                    source: "walkin",
                    stage: "contacted",
                    profileType: "individual",
                    name: "Priya Sharma",
                    gender: "female",
                    customerProfile: "self_employed",
                    maritalStatus: "married",
                    panNo: "PQRSX6789Z",
                    mobileNo: "9898989898",
                    altMobileNo: "",
                    email: "priya@example.com",
                    motherName: "Lakshmi",
                    loanAmount: 350000,
                    dsa: "none",
                    rcNo: "KA03CD5678",
                    vehicleVerient: "Hyundai i20 Sportz",
                    mfgYear: "2021",
                    osNo: "os_02",
                    kilometreReading: "18000",
                    vehicleOwnerContactNo: "9988776655",
                    vehicleLocation: "Bengaluru",
                    refFirstName: "Neeraj",
                    refFirstMobNo: "9111111111",
                    refSecondName: "Rohit",
                    refSecondMobNo: "9222222222",
                    nomineeName: "Arjun",
                    nomineeDob: "12/12/1992",
                    nomineeRelationship: "spouse",
                    permanentAddressType: "passport",
                    permanentAddressLandmark: "Near Metro Station",
                    permanentAddressCategory: "rent",
                    isCurrentAddressSame: false,
                    currentAddressType: "aadhaar",
                    currentAddressLandmark: "Opp. Mall",
                    currentAddressCategory: "rent",
                    isOfficeAddressSame: true,
                    employmentDetail: "Boutique Owner",
                    officeAddressType: "",
                    officeAddressLandmark: "",
                    bankFinance: "SBI",
                    branch: "MG Road",
                    loginExecutiveName: "Tarun",
                    caseDealer: "City Motors",
                    refNameMobNo: "Sanjay - 9333333333",
                    remarks: "Follow up next week",
                },
                {
                    id: crypto.randomUUID(),
                    loanId: `2025${(3).toString().padStart(5, "0")}`,
                    dateTime: now,
                    source: "online",
                    stage: "qualified",
                    profileType: "individual",
                    name: "Arun Patel",
                    gender: "male",
                    customerProfile: "salaried",
                    maritalStatus: "single",
                    panNo: "LMNOP1234Q",
                    mobileNo: "9000012345",
                    altMobileNo: "",
                    email: "arun@example.com",
                    motherName: "Kiran",
                    loanAmount: 420000,
                    dsa: "none",
                    rcNo: "MH12EF9012",
                    vehicleVerient: "Honda City VX",
                    mfgYear: "2020",
                    osNo: "os_03",
                    kilometreReading: "40000",
                    vehicleOwnerContactNo: "9000088888",
                    vehicleLocation: "Pune",
                    refFirstName: "Varun",
                    refFirstMobNo: "9555555555",
                    refSecondName: "Nikhil",
                    refSecondMobNo: "9666666666",
                    nomineeName: "",
                    nomineeDob: "",
                    nomineeRelationship: "",
                    permanentAddressType: "voter_id",
                    permanentAddressLandmark: "Near Riverfront",
                    permanentAddressCategory: "own",
                    isCurrentAddressSame: true,
                    currentAddressType: "",
                    currentAddressLandmark: "",
                    currentAddressCategory: "",
                    isOfficeAddressSame: false,
                    employmentDetail: "Analyst at FinCorp",
                    officeAddressType: "utility_bill",
                    officeAddressLandmark: "IT Park",
                    bankFinance: "ICICI",
                    branch: "Kothrud",
                    loginExecutiveName: "Divya",
                    caseDealer: "Prime Auto",
                    refNameMobNo: "Harish - 9444444444",
                    remarks: "Documents pending",
                },
            ];
            writeArray(LS_LEADS_KEY, sampleLeads);
        }
        if (disb.length === 0) {
            const now = new Date().toLocaleString();
            const sampleDisb: Disbursement[] = [
                {
                    id: crypto.randomUUID(),
                    loanId: `2025${(10001).toString().padStart(5, "0")}`,
                    dateTime: now,
                    source: "referral",
                    stage: "disbursed",
                    profileType: "individual",
                    name: "Kiran Rao",
                    gender: "female",
                    customerProfile: "salaried",
                    panNo: "ABCDE1234F",
                    mobileNo: "9123456780",
                    altMobileNo: "",
                    email: "kiran@example.com",
                    dsa: "none",
                    bankFinance: "HDFC",
                    bankFinanceBranch: "Jubilee",
                    loginExecutiveName: "Meera",
                    rcNo: "TS09AA9999",
                    vehicleVerient: "Tata Nexon XZ",
                    mfgYear: "2023",
                    osNo: "os_04",
                    kilometreReading: "5000",
                    vehicleOwnerContactNo: "9000000000",
                    totalLoanAmount: 650000,
                    pfCharges: 2500,
                    documentationCharges: 1000,
                    loanInsuranceCharges: 0,
                    otherCharges: 0,
                    rtoCharges: 1500,
                    netLoanAmount: 645000,
                    tenure: "48",
                    irr: "10.5",
                    emiAmount: "16500",
                    emiDate: "5",
                    transaction1: 300000,
                    transaction2: 345000,
                    remarksForHold: "",
                    utr: "UTR123456",
                    caseDealer: "Wheels Auto",
                    dealerMob: "9333300000",
                    rcCardStatus: "in_progress",
                    remarks: "First disbursement complete",
                },
            ];
            writeArray(LS_DISBURSEMENTS_KEY, sampleDisb);
        }
    } catch {
        // ignore seed failures
    }
}

// Seed disabled now that we use real backend
// try { seedDemoData(); } catch {}

// --- Loan ID ---
export const getNextLoanId = (): string => {
    // Generate a sequential Loan ID per year: YYYY + 5-digit sequence starting at 00001
    // Example for 2025: 202500001, 202500002, ...
    try {
        const year = new Date().getFullYear().toString();
        const storageKey = `loanIdCounter:${year}`;
        let seq = 0;
        if (typeof window !== "undefined" && window.localStorage) {
            const raw = window.localStorage.getItem(storageKey);
            seq = raw ? parseInt(raw, 10) : 0;
            seq += 1;
            window.localStorage.setItem(storageKey, String(seq));
        } else {
            // Fallback: if localStorage not available (shouldn't happen in client), start at 1
            seq = 1;
        }
        return `${year}${seq.toString().padStart(5, "0")}`;
    } catch {
        // Absolute fallback to a timestamp-based ID if anything goes wrong
        return `${new Date().getFullYear()}${Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0")}`;
    }
};

export const deleteLead = async (id: string): Promise<void> => {
    const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete lead");
};

// --- Leads ---
export const getLeads = async (offset = 0, limit = 50): Promise<Lead[]> => {
    const res = await fetch(`/api/leads?offset=${offset}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch leads");
    const data = (await res.json()) as Lead[];
    return data;
};

export const getLeadsCount = async (): Promise<number> => {
    const res = await fetch(`/api/leads/count`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch leads count");
    const { count } = (await res.json()) as { count: number };
    return count || 0;
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
    const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error("Failed to fetch lead");
    return (await res.json()) as Lead;
};

export const saveLead = async (lead: Lead): Promise<void> => {
    const res = await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error("Failed to create lead");
};

export const updateLead = async (updatedLead: Lead): Promise<void> => {
    const res = await fetch(`/api/leads/${encodeURIComponent(updatedLead.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
    });
    if (!res.ok) throw new Error("Failed to update lead");
};

// --- Disbursements ---
export const getDisbursements = async (
    offset = 0,
    limit = 50
): Promise<Disbursement[]> => {
    const res = await fetch(`/api/disbursements?offset=${offset}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch disbursements");
    return (await res.json()) as Disbursement[];
};

export const getDisbursementsCount = async (): Promise<number> => {
    const res = await fetch(`/api/disbursements/count`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch disbursements count");
    const { count } = (await res.json()) as { count: number };
    return count || 0;
};

export const getDisbursementById = async (
    id: string
): Promise<Disbursement | undefined> => {
    const res = await fetch(`/api/disbursements/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error("Failed to fetch disbursement");
    return (await res.json()) as Disbursement;
};

export const saveDisbursement = async (
    disbursement: Disbursement
): Promise<void> => {
    const res = await fetch(`/api/disbursements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disbursement),
    });
    if (!res.ok) throw new Error("Failed to create disbursement");
};

export const updateDisbursement = async (
    updatedDisbursement: Disbursement
): Promise<void> => {
    const res = await fetch(`/api/disbursements/${encodeURIComponent(updatedDisbursement.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDisbursement),
    });
    if (!res.ok) throw new Error("Failed to update disbursement");
};

export const deleteDisbursement = async (id: string): Promise<void> => {
    const res = await fetch(`/api/disbursements/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete disbursement");
};
