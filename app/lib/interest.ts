import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

export type InterestRequestInput = {
  email: string;
  source: string;
  featureKey?: string;
  message?: string;
  pathname?: string;
  referrer?: string;
  userAgent?: string;
};

export async function saveInterestRequest(input: InterestRequestInput) {
  if (!databaseUrl) {
    throw new Error("Missing Neon database URL.");
  }

  const sql = neon(databaseUrl);

  await sql`
    create table if not exists waitlist_requests (
      id bigserial primary key,
      email text not null,
      source text not null,
      feature_key text,
      message text,
      pathname text,
      referrer text,
      user_agent text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    insert into waitlist_requests (
      email,
      source,
      feature_key,
      message,
      pathname,
      referrer,
      user_agent
    )
    values (
      ${input.email},
      ${input.source},
      ${input.featureKey ?? null},
      ${input.message ?? null},
      ${input.pathname ?? null},
      ${input.referrer ?? null},
      ${input.userAgent ?? null}
    )
  `;
}
