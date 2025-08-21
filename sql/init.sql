-- Postgres schema for Wheels Web
-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  loan_id TEXT UNIQUE NOT NULL,
  date_time TEXT,
  source TEXT,
  stage TEXT,
  profile_type TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  customer_profile TEXT NOT NULL,
  marital_status TEXT,
  pan_no TEXT NOT NULL,
  mobile_no TEXT NOT NULL,
  alt_mobile_no TEXT,
  email TEXT NOT NULL,
  mother_name TEXT,
  loan_amount NUMERIC NOT NULL,
  dsa TEXT NOT NULL,
  rc_no TEXT NOT NULL,
  vehicle_verient TEXT NOT NULL,
  mfg_year TEXT,
  os_no TEXT,
  kilometre_reading TEXT,
  vehicle_owner_contact_no TEXT NOT NULL,
  vehicle_location TEXT,
  ref_first_name TEXT,
  ref_first_mob_no TEXT,
  ref_second_name TEXT,
  ref_second_mob_no TEXT,
  nominee_name TEXT,
  nominee_dob TEXT,
  nominee_relationship TEXT,
  permanent_address_type TEXT NOT NULL,
  permanent_address_landmark TEXT NOT NULL,
  permanent_address_category TEXT NOT NULL,
  is_current_address_same BOOLEAN DEFAULT false,
  current_address_type TEXT,
  current_address_landmark TEXT,
  current_address_category TEXT,
  is_office_address_same BOOLEAN DEFAULT false,
  employment_detail TEXT NOT NULL,
  office_address_type TEXT,
  office_address_landmark TEXT,
  bank_finance TEXT,
  branch TEXT,
  login_executive_name TEXT,
  case_dealer TEXT NOT NULL,
  ref_name_mob_no TEXT,
  remarks TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_loan_id ON leads(loan_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_mobile ON leads(mobile_no);

-- Create disbursement table
CREATE TABLE IF NOT EXISTS disbursement (
  id SERIAL PRIMARY KEY,
  loan_id TEXT UNIQUE NOT NULL,
  date_time TEXT,
  source TEXT,
  stage TEXT,
  profile_type TEXT,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  customer_profile TEXT NOT NULL,
  pan_no TEXT,
  mobile_no TEXT NOT NULL,
  email TEXT,
  dsa TEXT NOT NULL,
  rc_no TEXT NOT NULL,
  vehicle_verient TEXT NOT NULL,
  mfg_year TEXT NOT NULL,
  os_no TEXT NOT NULL,
  kilometre_reading TEXT,
  vehicle_owner_contact_no TEXT NOT NULL,
  bank_finance TEXT NOT NULL,
  bank_finance_branch TEXT NOT NULL,
  login_executive_name TEXT NOT NULL,
  case_dealer TEXT NOT NULL,
  dealer_mob TEXT,
  remarks TEXT,
  total_loan_amount NUMERIC NOT NULL,
  pf_charges NUMERIC,
  documentation_charges NUMERIC,
  loan_insurance_charges NUMERIC,
  other_charges NUMERIC,
  rto_charges NUMERIC,
  net_loan_amount NUMERIC,
  tenure TEXT,
  irr TEXT,
  emi_amount TEXT,
  emi_date TEXT,
  transaction1 NUMERIC NOT NULL,
  transaction2 NUMERIC,
  remarks_for_hold TEXT,
  utr TEXT,
  rc_card_status TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_disb_loan_id ON disbursement(loan_id);
CREATE INDEX IF NOT EXISTS idx_disb_stage ON disbursement(stage);



-- Credentials table for app authentication (admin/user, unique per role)
CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL PRIMARY KEY,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'user')),
  username VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  CONSTRAINT unique_role UNIQUE (role)
);
