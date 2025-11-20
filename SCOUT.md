# SCOUT.md - Project Overview

## High Level Overview
**TimeVault** is a modern, fast web interface for searching the Internet Archive's Wayback Machine. It allows users to enter a URL and browse archived snapshots with advanced filtering and a smooth user experience.

The project is built with **Next.js 14 (App Router)** and emphasizes performance with virtual scrolling and multi-layer caching.

## Tech Stack
- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS, Radix UI, shadcn/ui
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Performance:** `@tanstack/react-virtual` for handling large lists of snapshots
- **API:** Proxies the Wayback Machine CDX Server API

## Key Features
- **Search:** Query any URL for archived versions.
- **Filtering:** Filter by year, HTTP status code, MIME type, or text.
- **Performance:** handle thousands of results without lag using virtual scrolling.
- **Caching:**
  - **Client:** SWR with 60s deduplication.
  - **Server:** In-memory cache (Map) with 24h TTL to reduce load on the external API.
- **Stats:** Visual dashboard of snapshot statistics.

## Project Structure
- `app/`: Next.js App Router pages and API routes.
  - `app/api/wayback/`: The proxy endpoint for the CDX API.
  - `app/page.tsx`: The main search interface.
- `components/`: React components.
  - `components/ui/`: Reusable UI components (shadcn/ui).
  - `components/virtualized-snapshot-list.tsx`: Core component for rendering results efficiently.
- `lib/`: Utilities and hooks.
  - `lib/hooks/useWaybackSearch.ts`: Custom hook managing the search logic and data fetching.

## Getting Started
1.  **Install:** `pnpm install`
2.  **Run Dev:** `pnpm dev`
3.  **Build:** `pnpm build`

## Roadmap & Next Steps
The `IMPROVEMENT_ROADMAP.md` file lists prioritized tasks. Quick wins include:
-   **Shareable URLs:** Sync search state to URL query params.
-   **Export:** Allow downloading results as CSV/JSON.
-   **Keyboard Shortcuts:** Add more navigation shortcuts.

For a deep dive into the implementation, see `ARCHITECTURE.md`.
