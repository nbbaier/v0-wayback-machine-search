# Cloud-Native State & Cache Layer

**Category:** Architecture
**Quarter:** Q1
**T-shirt Size:** L

## Why This Matters

Currently, TimeVault relies on in-memory caching (`Map`) and browser-based `localStorage`. This is fragile: server restarts wipe the cache (increasing load on the Wayback Machine), and user history is locked to a single device. To scale, we need persistent, distributed state. Moving to a managed Redis and Postgres layer will enable robust rate limiting, persistent caching across deployments, and the foundation for user accounts.

## Current State

- **Cache:** In-memory `Map` in `app/api/wayback/route.ts`. Cleared on every deployment/restart.
- **Persistence:** `localStorage` for search history.
- **Rate Limiting:** None. Vulnerable to abuse.

## Proposed Future State

A serverless-friendly architecture using Upstash Redis for hot caching and rate limiting, and a Postgres database (via Supabase or Neon) for structured data.

- **Redis:** Stores API responses with a 24h TTL. Shared across all serverless function instances.
- **Postgres:** Stores user profiles, saved searches, and "starred" snapshots.
- **Rate Limiting:** Middleware intercepts requests, checking Redis to throttle abusive IPs.

## Key Deliverables

- [ ] Integration of `@upstash/redis` for shared API caching.
- [ ] Implementation of a Sliding Window rate limiter using `@upstash/ratelimit`.
- [ ] Setup of Prisma ORM with a Postgres provider.
- [ ] Migration of "Search History" from `localStorage` to a proper database table (optional sync for unauthenticated users).
- [ ] Environment variable configuration for production database connection.

## Prerequisites

- None, but requires setting up external cloud resources (Vercel Storage, Upstash, or Supabase).

## Risks & Open Questions

- **Cost:** Moving from free in-memory to managed services introduces cost. Need to monitor usage.
- **Latency:** Redis round-trip adds ms compared to in-memory, but improves hit-rate across instances.
- **Privacy:** Storing user search history requires a clear privacy policy.

## Notes

Reference `IMPROVEMENT_ROADMAP.md` items #17 (Rate Limiting) and #18 (Database Integration).
