import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const { rows } = await query<{ count: string }>(`SELECT COUNT(*)::text as count FROM leads`);
  const count = parseInt(rows[0]?.count || "0", 10);
  return NextResponse.json({ count });
}
