// Helper function to convert string arrays to option objects
const createOptions = (items: string[]) => items.map(item => ({ label: item, value: item }));

export const SOURCES = createOptions(["Self", "Dealer", "Bank","UC Showroom ","NC Showroom","Others"]);
export const STAGES = createOptions(["Lead", "Cibil", "Login", "Sanction", "Disbursed","Rejected"]);
export const PROFILE_TYPES = createOptions(["Sale Purchase", "Refinance", "Int Refinance", "Balance Transfer", "BT + Topup", "Int Topup"]);
export const GENDERS = createOptions(["Male", "Female", "Other"]);
export const CUSTOMER_PROFILES = createOptions(["Self-Employed", "Salaried", "ITR", "Agriculture","Govt Employed","Pensioner","Other"]);
export const MARITAL_STATUSES = createOptions(["Un-married", "Married", "Married with Kids"]);
export const DSAS = createOptions(["Wheels Web", "Girnar Software Pvt Ltd", "Kuwy", "Tractor Junction", "Cars Adda"]);
export const MFG_YEARS = createOptions(["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"]);
export const OS_NOS = createOptions(["1", "2", "3", "4", "5"]);
export const RELATIONSHIPS = createOptions(["Father", "Mother", "Brother", "Spouse", "Son", "Daughter", "Sister","Others"]);
export const ADDRESS_PROOFS = createOptions(["As Per Aadhaar", "As Per Voter ID", "As Per Gas Bill", "As Per Agreements"]);
export const ADDRESS_CATEGORIES = createOptions(["RENTED", "SELF-OWNED", "PARANTEL"]);
export const BANKS = createOptions(["AXIS BANK", "Piramal", "Mahindra Finance", "Poonawalla Fincorp", "IDFC First Bank (Urban & Rural)", "HDFC Bank", "HDB FINANCE", "Bajaj Finserv", "ICICI Bank", "YES BANK LTD", "Tata Capital", "TVS Credit", "Muthoot Capital", "INDUSIND Bank", "EQUITAS SMALL FINANCE BANK", "Toyota Financial", "Manappuram Finance Limited", "AU FINANCE", "Cholamandalam Investment And Finance Company", "Saraswat Co-operative Bank", "Kotak Mahindra", "Bandhan Bank", "Kogta Financier", "Muthoot Money", "Fortune Finance", "Ambit Finvest Private Limited", "IKF Finance (White Board Cars)", "Mahaveer Finance", "Indostar Finance", "Vaasthu Finance", "Praveen Capital"]);
export const DISBURSEMENT_STAGES = createOptions(["Filed", "Disbursed", "Cancellation"]);
export const TENURES = createOptions(Array.from({ length: 180 }, (_, i) => (i + 1).toString()));
export const EMI_DATES = createOptions(Array.from({ length: 31 }, (_, i) => (i + 1).toString()));
export const RC_CARD_STATUSES = createOptions(["SELLER/CUSTOMER", "RTO", "WHEELS WEB OFFICE", "CUSTOMER RECIEVED"]);
