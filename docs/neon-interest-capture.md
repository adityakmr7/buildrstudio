# Neon Interest Capture

BuildrStudio now stores early-access and roadmap interest through a server-side API route backed by Neon Postgres.

## Files Changed

- `app/api/interest/route.ts`
- `app/lib/interest.ts`
- `app/components/PremiumModal.tsx`
- `app/components/RoadmapRequestForm.tsx`
- `app/roadmap/page.tsx`
- `package.json`

## Environment

Set one of these environment variables in Vercel:

```bash
NEON_DATABASE_URL=postgresql://...
```

or:

```bash
DATABASE_URL=postgresql://...
```

## Storage

The API creates this table automatically on first successful submit:

```sql
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
);
```

## Current Event

The premium modal sends:

```json
{
  "source": "premium_modal",
  "featureKey": "premium-branding-4k-export"
}
```

The same `/api/interest` route can be reused for roadmap votes by changing `source` and `featureKey`.

## Roadmap Event

The roadmap page sends:

```json
{
  "source": "roadmap_request",
  "featureKey": "selected-roadmap-tool"
}
```
