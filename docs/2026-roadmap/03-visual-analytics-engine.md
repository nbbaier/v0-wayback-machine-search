# "Time Travel" Visual Analytics Engine

**Category:** New Feature
**Quarter:** Q2
**T-shirt Size:** L

## Why This Matters

A list of dates is functional, but dry. Users trying to understand the _evolution_ of a website need to see patterns: When was the site most active? When did it go offline (404s)? A visual analytics engine turns raw data into insights, differentiating TimeVault from the standard Wayback interface.

## Current State

-  Text-based list of snapshots.
-  Basic "Cards" and "Table" views.
-  `timeline/page.tsx` exists but is essentially a list grouped by year/month, not a chart.

## Proposed Future State

An interactive dashboard at the top of the results page featuring:

-  **Activity Heatmap:** GitHub-style contribution graph showing snapshot density per day.
-  **Status Code Distribution:** Donut chart showing 200 vs 3xx vs 4xx responses.
-  **Interactive Brush Chart:** A timeline where users can "brush" (drag) to select a specific date range, instantly filtering the list below.

## Key Deliverables

-  [ ] Install `recharts` or `visx`.
-  [ ] Create `SnapshotFrequencyChart` component (bar chart of snapshots per month).
-  [ ] Create `StatusDistributionChart` (pie/donut chart).
-  [ ] Implement "brush" interaction to filter the `results` state in `useWaybackSearch`.
-  [ ] Add "Deep Dive" analytics view for power users.

## Prerequisites

-  `01-cloud-native-architecture` is helpful for caching the heavy aggregations, but not strictly required.

## Risks & Open Questions

-  **Performance:** Aggregating 1000+ data points on the client can be heavy. May need to move aggregation logic to a Web Worker or memoize heavily.
-  **Mobile:** Charts are notoriously hard to make responsive. Need a fallback or simplified view for mobile.

## Notes

See `IMPROVEMENT_ROADMAP.md` item #5 (Visual Timeline Chart).
