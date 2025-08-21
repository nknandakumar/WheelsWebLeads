import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

function mapRowToLead(row: any) {
  return {
    id: row.loan_id ?? "",
    loanId: row.loan_id ?? "",
    dateTime: row.date_time ?? "",
    source: row.source ?? "",
    stage: row.stage ?? "",
    profileType: row.profile_type,
    name: row.name,
    gender: row.gender,
    customerProfile: row.customer_profile,
    maritalStatus: row.marital_status ?? "",
    panNo: row.pan_no,
    mobileNo: row.mobile_no,
    altMobileNo: row.alt_mobile_no ?? "",
    email: row.email,
    motherName: row.mother_name ?? "",
    loanAmount: row.loan_amount,
    dsa: row.dsa,
    rcNo: row.rc_no,
    vehicleVerient: row.vehicle_verient,
    mfgYear: row.mfg_year ?? "",
    osNo: row.os_no ?? "",
    kilometreReading: row.kilometre_reading ?? "",
    vehicleOwnerContactNo: row.vehicle_owner_contact_no,
    vehicleLocation: row.vehicle_location ?? "",
    refFirstName: row.ref_first_name ?? "",
    refFirstMobNo: row.ref_first_mob_no ?? "",
    refSecondName: row.ref_second_name ?? "",
    refSecondMobNo: row.ref_second_mob_no ?? "",
    nomineeName: row.nominee_name ?? "",
    nomineeDob: row.nominee_dob ?? "",
    nomineeRelationship: row.nominee_relationship ?? "",
    permanentAddressType: row.permanent_address_type,
    permanentAddressLandmark: row.permanent_address_landmark,
    permanentAddressCategory: row.permanent_address_category,
    isCurrentAddressSame: row.is_current_address_same ?? false,
    currentAddressType: row.current_address_type ?? "",
    currentAddressLandmark: row.current_address_landmark ?? "",
    currentAddressCategory: row.current_address_category ?? "",
    isOfficeAddressSame: row.is_office_address_same ?? false,
    employmentDetail: row.employment_detail,
    officeAddressType: row.office_address_type ?? "",
    officeAddressLandmark: row.office_address_landmark ?? "",
    bankFinance: row.bank_finance ?? "",
    branch: row.branch ?? "",
    loginExecutiveName: row.login_executive_name ?? "",
    caseDealer: row.case_dealer,
    refNameMobNo: row.ref_name_mob_no ?? "",
    remarks: row.remarks ?? "",
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { rows } = await query(`SELECT * FROM leads WHERE loan_id = $1`, [id]);
  if (rows.length === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(mapRowToLead(rows[0]));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const fields = [
    "loan_id","date_time","source","stage","profile_type","name","gender","customer_profile","marital_status",
    "pan_no","mobile_no","email","loan_amount","dsa",
    "rc_no","vehicle_verient","mfg_year","os_no","kilometre_reading","vehicle_owner_contact_no","vehicle_location",
    "ref_first_name","ref_first_mob_no","ref_second_name","ref_second_mob_no",
    "nominee_name","nominee_dob","nominee_relationship",
    "permanent_address_type","permanent_address_landmark","permanent_address_category",
    "is_current_address_same","current_address_type","current_address_landmark","current_address_category",
    "is_office_address_same","employment_detail","office_address_type","office_address_landmark",
    "bank_finance","branch","login_executive_name",
    "case_dealer","ref_name_mob_no","remarks"
  ];
  const values = [
    body.loanId || null,
    body.dateTime || null,
    body.source || null,
    body.stage || null,
    body.profileType,
    body.name,
    body.gender,
    body.customerProfile,
    body.maritalStatus || null,
    body.panNo,
    body.mobileNo,
    body.email,
    body.loanAmount,
    body.dsa,
    body.rcNo,
    body.vehicleVerient,
    body.mfgYear || null,
    body.osNo || null,
    body.kilometreReading || null,
    body.vehicleOwnerContactNo,
    body.vehicleLocation || null,
    body.refFirstName || null,
    body.refFirstMobNo || null,
    body.refSecondName || null,
    body.refSecondMobNo || null,
    body.nomineeName || null,
    body.nomineeDob || null,
    body.nomineeRelationship || null,
    body.permanentAddressType,
    body.permanentAddressLandmark,
    body.permanentAddressCategory,
    !!body.isCurrentAddressSame,
    body.currentAddressType || null,
    body.currentAddressLandmark || null,
    body.currentAddressCategory || null,
    !!body.isOfficeAddressSame,
    body.employmentDetail,
    body.officeAddressType || null,
    body.officeAddressLandmark || null,
    body.bankFinance || null,
    body.branch || null,
    body.loginExecutiveName || null,
    body.caseDealer,
    body.refNameMobNo || null,
    body.remarks || null,
  ];

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const { rows } = await query(
    `UPDATE leads SET ${setClause} WHERE loan_id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  if (rows.length === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(mapRowToLead(rows[0]));
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await query(`DELETE FROM leads WHERE loan_id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
