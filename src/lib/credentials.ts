import { query } from "@/lib/db";

export type Role = "admin" | "user";

export interface DBCredential {
  id: number;
  role: Role;
  username: string;
  password: string; // stored (hashed or plaintext)
}

export async function getAllCredentials(): Promise<DBCredential[]> {
  const { rows } = await query<DBCredential>(
    `SELECT id, role, username, password FROM credentials`
  );
  return rows;
}

export async function getCredentialByRole(role: Role): Promise<DBCredential | null> {
  const { rows } = await query<DBCredential>(
    `SELECT id, role, username, password FROM credentials WHERE role = $1 LIMIT 1`,
    [role]
  );
  return rows[0] || null;
}

export async function findCredentialByUsername(username: string): Promise<DBCredential | null> {
  const { rows } = await query<DBCredential>(
    `SELECT id, role, username, password FROM credentials WHERE username = $1 LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

export async function verifyPassword(stored: string, input: string): Promise<boolean> {
  // Plaintext comparison
  return stored === input;
}

export async function upsertCredential(role: Role, username: string, password: string) {
  // Store plaintext password as requested
  await query(
    `INSERT INTO credentials (role, username, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (role)
     DO UPDATE SET username = EXCLUDED.username, password = EXCLUDED.password`,
    [role, username, password]
  );
}

// Update only provided fields. If password provided, hash it.
export async function updateCredential(role: Role, fields: { username?: string; password?: string }) {
  const sets: string[] = [];
  const values: any[] = [];

  if (fields.username !== undefined) {
    sets.push(`username = $${sets.length + 1}`);
    values.push(fields.username);
  }
  if (fields.password !== undefined) {
    sets.push(`password = $${sets.length + 1}`);
    values.push(fields.password);
  }
  if (sets.length === 0) return; // nothing to update

  // role condition param
  values.push(role);
  const updateSql = `UPDATE credentials SET ${sets.join(", ")} WHERE role = $${sets.length + 1}`;

  const result = await query(updateSql, values);
  // If no row updated (role not present), insert new with defaults for missing fields
  if ((result as any)?.rowCount === 0) {
    const username = fields.username ?? "";
    const password = fields.password ?? "";
    if (!username || !password) return; // require both on initial insert
    await upsertCredential(role, username, password);
  }
}
