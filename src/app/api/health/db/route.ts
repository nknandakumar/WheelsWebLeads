import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Basic connectivity
    const ping = await query<{ one: number }>("SELECT 1 as one");

    // Check for required tables
    const tables = await query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('leads','disbursement','credentials')`
    );
    const present = tables.rows.map((r) => r.table_name).sort();
    const missing = ["leads", "disbursement", "credentials"].filter((t) => !present.includes(t));

    return NextResponse.json({
      ok: true,
      select1: ping.rows?.[0]?.one === 1,
      tables_present: present,
      tables_missing: missing,
      hint: missing.length
        ? "Run sql/init.sql against your DATABASE_URL to create missing tables."
        : "All required tables exist.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "DB health check failed" },
      { status: 500 }
    );
  }
}
