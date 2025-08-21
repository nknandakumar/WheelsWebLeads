import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { rows } = await query<{ count: string }>(`SELECT COUNT(*)::text as count FROM disbursement`);
    const count = parseInt(rows[0]?.count || "0", 10);
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch disbursements count" }, { status: 500 });
  }
}
