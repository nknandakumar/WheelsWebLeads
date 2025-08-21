import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

function mapRow(row: any) {
  return {
    id: row.loan_id ?? "",
    loanId: row.loan_id ?? "",
    dateTime: row.date_time ?? "",
    source: row.source ?? "",
    stage: row.stage ?? "",
    profileType: row.profile_type ?? "",
    name: row.name,
    gender: row.gender,
    customerProfile: row.customer_profile,
    panNo: row.pan_no ?? "",
    mobileNo: row.mobile_no,
    email: row.email ?? "",
    dsa: row.dsa,
    rcNo: row.rc_no,
    vehicleVerient: row.vehicle_verient,
    mfgYear: row.mfg_year,
    osNo: row.os_no,
    kilometreReading: row.kilometre_reading ?? "",
    vehicleOwnerContactNo: row.vehicle_owner_contact_no,
    bankFinance: row.bank_finance,
    bankFinanceBranch: row.bank_finance_branch,
    loginExecutiveName: row.login_executive_name,
    caseDealer: row.case_dealer,
    dealerMob: row.dealer_mob ?? "",
    remarks: row.remarks ?? "",
    totalLoanAmount: row.total_loan_amount,
    pfCharges: row.pf_charges ?? 0,
    documentationCharges: row.documentation_charges ?? 0,
    loanInsuranceCharges: row.loan_insurance_charges ?? 0,
    otherCharges: row.other_charges ?? 0,
    rtoCharges: row.rto_charges ?? 0,
    netLoanAmount: row.net_loan_amount ?? 0,
    tenure: row.tenure ?? "",
    irr: row.irr ?? "",
    emiAmount: row.emi_amount ?? "",
    emiDate: row.emi_date ?? "",
    transaction1: row.transaction1,
    transaction2: row.transaction2 ?? 0,
    remarksForHold: row.remarks_for_hold ?? "",
    utr: row.utr ?? "",
    rcCardStatus: row.rc_card_status,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const { rows } = await query(`SELECT * FROM disbursement ORDER BY id DESC OFFSET $1 LIMIT $2`, [offset, limit]);
  return NextResponse.json(rows.map(mapRow));
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const { rows } = await query(
    `INSERT INTO disbursement (
      loan_id, date_time, source, stage,
      profile_type, name, gender, customer_profile, pan_no, mobile_no, email, dsa,
      rc_no, vehicle_verient, mfg_year, os_no, kilometre_reading, vehicle_owner_contact_no,
      bank_finance, bank_finance_branch, login_executive_name,
      case_dealer, dealer_mob, remarks,
      total_loan_amount, pf_charges, documentation_charges, loan_insurance_charges, other_charges, rto_charges, net_loan_amount,
      tenure, irr, emi_amount, emi_date,
      transaction1, transaction2, remarks_for_hold, utr, rc_card_status
    ) VALUES (
      $1,$2,$3,$4,
      $5,$6,$7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17,$18,
      $19,$20,$21,
      $22,$23,$24,
      $25,$26,$27,$28,$29,$30,$31,
      $32,$33,$34,$35,
      $36,$37,$38,$39,$40
    ) RETURNING *`,
    [
      b.loanId || null, b.dateTime || null, b.source || null, b.stage || null,
      b.profileType || null, b.name, b.gender, b.customerProfile, b.panNo || null, b.mobileNo, b.email || null, b.dsa,
      b.rcNo, b.vehicleVerient, b.mfgYear, b.osNo, b.kilometreReading || null, b.vehicleOwnerContactNo,
      b.bankFinance, b.bankFinanceBranch, b.loginExecutiveName,
      b.caseDealer, b.dealerMob || null, b.remarks || null,
      b.totalLoanAmount, b.pfCharges || null, b.documentationCharges || null, b.loanInsuranceCharges || null, b.otherCharges || null, b.rtoCharges || null, b.netLoanAmount || null,
      b.tenure || null, b.irr || null, b.emiAmount || null, b.emiDate || null,
      b.transaction1, b.transaction2 || null, b.remarksForHold || null, b.utr || null, b.rcCardStatus
    ]
  );
  return NextResponse.json(mapRow(rows[0]), { status: 201 });
}
