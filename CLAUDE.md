# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TimeVault is a Next.js 15 application that provides a modern interface for the Internet Archive's Wayback Machine CDX Server API. It allows users to search archived web snapshots with advanced filtering, statistics, and multiple view modes (cards, table, timeline).

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code with Biome
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Check code with Biome (format + lint)
npm run check
```

## Code Style & Formatting

This project uses **Biome** (not ESLint/Prettier) for linting and formatting:

- **Indentation:** Tabs (configured in biome.json)
- **Quotes:** Double quotes for JavaScript/TypeScript
- **Import organization:** Auto-organized on save/check
- Always run `npm run check` before committing to ensure code quality

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Radix UI, shadcn/ui
- **Styling:** Tailwind CSS v4
- **Data Fetching:** SWR with client-side caching
- **Performance:** @tanstack/react-virtual for virtual scrolling
- **Language:** TypeScript with strict mode

## Architecture Overview

### Two-Tier Caching Strategy

1. **Client-side (SWR):** 60-second deduplication window, prevents redundant requests
2. **Server-side (API Route):** 24-hour in-memory cache with max 500 entries, lazy cleanup strategy

### Request Flow

```
User Input → useWaybackSearch Hook → /api/wayback Route → CDX API
             ↓ (SWR cache)          ↓ (in-memory cache)
          Components ← JSON Response ← Cached/Fresh Data
```

### Key Files & Responsibilities

- **app/page.tsx:** Main search interface (cards view)
- **app/table/page.tsx:** Table view of snapshots
- **app/timeline/page.tsx:** Timeline visualization
- **app/api/wayback/route.ts:** Proxy API with server-side caching
- **lib/hooks/useWaybackSearch.ts:** SWR-powered data fetching hook
- **lib/types/archive.ts:** TypeScript type definitions
- **components/virtualized-snapshot-list.tsx:** Virtual scrolling for performance
- **components/snapshot/\*:** Snapshot display components for different views
- **components/search/\*:** Search form and controls

## Important Implementation Details

### Virtual Scrolling

Large result sets (1000+ snapshots) use `@tanstack/react-virtual` for performance. The virtualizer:

- Renders only visible items (~10-20 DOM nodes vs 1000+)
- Calculates dynamic heights per group
- Uses 2-item overscan for smooth scrolling

### Client-Side Filtering

Filtering by status code, MIME type, and text happens **client-side** after data is fetched. This provides instant feedback without additional API calls. The data is already loaded, so filtering is O(n) on the snapshot array.

### Year Filtering

Year filters are passed to the CDX API via `from` and `to` query parameters. These are **server-side** filters that reduce the data returned from the Archive.

### Search History

Stored in `localStorage` with max 10 entries. New searches are prepended, duplicates are moved to the top.

### Cache Management

The API route cache:

- Uses full CDX URL as cache key
- Lazy cleanup on each request (only removes expired entries)
- LRU eviction when MAX_CACHE_ENTRIES (500) is exceeded
- 24-hour TTL appropriate for historical data

## View Modes

The app has three view modes accessible via navigation:

1. **Cards** (`/cards`): Grouped by date with collapsible cards
2. **Table** (`/table`): Sortable table view with pagination
3. **Timeline** (`/timeline`): Chronological timeline visualization

Each view consumes the same `useWaybackSearch` hook but renders differently.

## Type System

Core types are in `lib/types/archive.ts`:

- **ArchiveResult:** Single snapshot with timestamp, URL, status, mimetype, length
- **GroupedSnapshot:** Snapshots grouped by date
- **GroupedSnapshotByMonth:** Snapshots grouped by year/month
- **SortColumn & SortDirection:** For table sorting

## Component Organization

```
components/
├── ui/              # shadcn/ui primitives (button, card, input, etc.)
├── snapshot/        # Snapshot-specific components
│   ├── cards-date-group.tsx
│   ├── table-snapshot-row.tsx
│   ├── timeline-snapshot-card.tsx
│   ├── snapshot-metadata.tsx
│   ├── snapshot-preview.tsx
│   └── status-badge.tsx
└── search/          # Search UI components
    ├── search-form.tsx
    ├── search-header.tsx
    └── search-states.tsx
```

## Common Patterns

### Adding a New Component

1. Use shadcn/ui CLI: `npx shadcn@latest add [component]`
2. Components are copied to `components/ui/` (not from node_modules)
3. Customize using Tailwind classes and CSS variables

### Adding a New API Parameter

1. Update type in `lib/hooks/useWaybackSearch.ts`
2. Pass parameter in URL construction
3. Validate in `app/api/wayback/route.ts`
4. Forward to CDX API if needed

### Formatting Utilities

Use existing formatters in `lib/utils/formatters.ts`:

- `formatDate(timestamp)`: Converts YYYYMMDDHHmmss → "Jan 1, 2024 at 3:45 PM"
- `formatBytes(bytes)`: Converts bytes → "1.5 MB"

## Theme System

Uses `next-themes` with CSS variables:

- System preference detection
- Manual toggle (light/dark/system)
- CSS variables defined in `app/globals.css`
- Tailwind configured to read `hsl(var(--primary))` syntax

## Performance Considerations

- Virtual scrolling is critical for >500 snapshots
- Client-side filtering is fast enough (no debouncing needed)
- SWR `keepPreviousData: true` prevents UI flicker during refetch
- API route cache reduces load on Internet Archive infrastructure

## External API

The CDX Server API documentation: https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server

Query parameters we use:

- `url`: Target URL to search
- `output=json`: Response format
- `fl=timestamp,original,statuscode,mimetype,length`: Fields to return
- `from` / `to`: Year range filters (YYYY format)
- `limit=1000`: Max results per request

## Known Limitations

- 1000 snapshot limit per request (CDX API constraint)
- Cache is in-memory (lost on serverless cold starts)
- No pagination for >1000 results
- No user accounts or persistent preferences (uses localStorage)

## Related Documentation

Comprehensive docs are available in the repo root:

- **ARCHITECTURE.md:** Deep dive into system design and decisions
- **API_DOCUMENTATION.md:** Detailed API reference
- **IMPROVEMENT_ROADMAP.md:** Planned features and enhancements
- **USAGE_GUIDE.md:** End-user documentation
