import { Pool } from "pg";

// Singleton Pool for serverless/Next.js
let pool: Pool | undefined;

export function getPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set. Please add it to your .env.local");
    }
    // Neon connection via single URL
    pool = new Pool({
      connectionString: databaseUrl,
      // sslmode=require is in the URL; keep this to avoid self-signed issues
      ssl: { rejectUnauthorized: false },
      max: 10,
      // Add sensible timeouts to fail fast instead of hanging ~20s+
      connectionTimeoutMillis: 5000, // fail connecting within 5s
      idleTimeoutMillis: 10000, // release idle clients after 10s
      statement_timeout: 15000, // server-side statement timeout (ms)
      query_timeout: 15000, // client-side query timeout (ms)
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const client = await getPool().connect();
  try {
    const res = await client.query(text, params);
    return { rows: res.rows as T[] };
  } finally {
    client.release();
  }
}
