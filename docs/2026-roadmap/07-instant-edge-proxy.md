# The "Instant" Edge Proxy

**Category:** Performance
**Quarter:** Q4
**T-shirt Size:** M

## Why This Matters

The Wayback Machine CDX API can be slow and unreliable (often taking 2-5 seconds or timing out). Our current node-based API route adds latency. Moving the proxy layer to the Edge (Vercel Edge Functions or Cloudflare Workers) allows us to cache responses geographically closer to the user and handle connection keep-alives better.

## Current State

- Node.js runtime for `/api/wayback`.
- In-memory cache is local to the lambda instance (inefficient).

## Proposed Future State

- Migrate `/api/wayback` to the **Edge Runtime**.
- Implement a sophisticated `stale-while-revalidate` caching strategy using the Edge Cache API.
- Use `fetch` with streaming support to pipe data to the client as it arrives, rather than buffering the whole JSON response.

## Key Deliverables

- [ ] Refactor `app/api/wayback/route.ts` to use `export const runtime = 'edge'`.
- [ ] Replace the in-memory `Map` cache with Vercel KV or Edge Config (or just rely on standard HTTP Cache-Control headers if Vercel handles them correctly at the edge).
- [ ] Implement streaming JSON parsing/stringifying to reduce memory footprint.

## Prerequisites

- `01-cloud-native-architecture` (if we use Redis for the cache, we need an HTTP-based Redis client like `@upstash/redis` which works on Edge).

## Risks & Open Questions

- **Compatibility:** Node.js APIs (like `fs` or some crypto libs) aren't available on Edge. Need to ensure our code is standard Web API compliant.
- **Payload Limits:** Edge functions often have stricter payload size limits.

## Notes

This transforms the app from "feeling like a proxy" to "feeling like a native database".
