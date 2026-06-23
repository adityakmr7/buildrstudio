import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

export function getDb() {
  if (!databaseUrl) {
    throw new Error("Missing NEON_DATABASE_URL or DATABASE_URL environment variable.");
  }
  return neon(databaseUrl);
}

export async function initAuthTables() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      email_verified TIMESTAMPTZ,
      image TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ls_subscription_id TEXT UNIQUE,
      ls_customer_id TEXT,
      ls_variant_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      current_period_end TIMESTAMPTZ,
      cancel_at_period_end BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
}

export async function findOrCreateUser(profile: {
  email: string;
  name: string;
  image?: string;
}): Promise<{ id: string; email: string; name: string; image: string | null }> {
  const sql = getDb();

  await initAuthTables();

  const existing = await sql`
    SELECT id, email, name, image FROM users WHERE email = ${profile.email} LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE users SET name = ${profile.name}, image = ${profile.image ?? null}
      WHERE id = ${existing[0].id}
    `;
    return existing[0] as { id: string; email: string; name: string; image: string | null };
  }

  const inserted = await sql`
    INSERT INTO users (email, name, image, email_verified)
    VALUES (${profile.email}, ${profile.name}, ${profile.image ?? null}, now())
    RETURNING id, email, name, image
  `;

  return inserted[0] as { id: string; email: string; name: string; image: string | null };
}

export async function getActiveSubscription(userId: string) {
  const sql = getDb();

  const rows = await sql`
    SELECT id, ls_subscription_id, ls_variant_id, status, current_period_end, cancel_at_period_end
    FROM subscriptions
    WHERE user_id = ${userId}
      AND status IN ('active', 'on_trial', 'paused')
      AND (current_period_end IS NULL OR current_period_end > now())
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows.length > 0 ? rows[0] : null;
}

export async function upsertSubscription(data: {
  userId: string;
  lsSubscriptionId: string;
  lsCustomerId: string;
  lsVariantId: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}) {
  const sql = getDb();

  await initAuthTables();

  const existing = await sql`
    SELECT id FROM subscriptions WHERE ls_subscription_id = ${data.lsSubscriptionId} LIMIT 1
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE subscriptions SET
        status = ${data.status},
        current_period_end = ${data.currentPeriodEnd},
        cancel_at_period_end = ${data.cancelAtPeriodEnd},
        updated_at = now()
      WHERE ls_subscription_id = ${data.lsSubscriptionId}
    `;
  } else {
    await sql`
      INSERT INTO subscriptions (
        user_id, ls_subscription_id, ls_customer_id, ls_variant_id,
        status, current_period_end, cancel_at_period_end
      ) VALUES (
        ${data.userId}, ${data.lsSubscriptionId}, ${data.lsCustomerId},
        ${data.lsVariantId}, ${data.status}, ${data.currentPeriodEnd},
        ${data.cancelAtPeriodEnd}
      )
    `;
  }
}

export async function findUserByEmail(email: string) {
  const sql = getDb();
  const rows = await sql`SELECT id, email, name, image FROM users WHERE email = ${email} LIMIT 1`;
  return rows.length > 0 ? rows[0] : null;
}

export async function getAiUsageToday(identifier: string): Promise<number> {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS ai_usage (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      identifier TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  const rows = await sql`
    SELECT COUNT(*)::int AS count FROM ai_usage
    WHERE identifier = ${identifier} AND created_at > now() - interval '1 day'
  `;
  return rows[0]?.count ?? 0;
}

export async function recordAiUsage(identifier: string) {
  const sql = getDb();
  await sql`INSERT INTO ai_usage (identifier) VALUES (${identifier})`;
}
