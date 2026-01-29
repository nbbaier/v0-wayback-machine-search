# Batch Forensics Mode

**Category:** New Feature
**Quarter:** Q4
**T-shirt Size:** L

## Why This Matters

Currently, TimeVault is single-player: one URL at a time. Professional digital archivists or cybersecurity analysts often need to check the history of *lists* of domains (e.g., checking for expired domains that were previously active). Batch mode opens the tool to a new enterprise/power-user audience.

## Current State

- Single search input.
- One active search at a time.

## Proposed Future State

A "Batch Search" interface where users can:
1.  Paste a list of URLs (newline separated).
2.  The system processes them in a concurrency-controlled queue (e.g., 3 at a time).
3.  Results are aggregated into a summary table (e.g., "Domain | First Seen | Last Seen | Total Snapshots").
4.  Users can click into details for any specific domain.

## Key Deliverables

- [ ] Create `BatchSearchForm` (textarea input).
- [ ] Implement a client-side queue manager (using `p-queue` or similar).
- [ ] Design a `BatchSummaryTable` component.
- [ ] Add "Export All" functionality for batch results.

## Prerequisites

- `01-cloud-native-architecture` (Rate limiting becomes CRITICAL here to avoid getting our IP banned by the Internet Archive).

## Risks & Open Questions

- **Rate Limits:** We become a "noisy neighbor" to the Wayback Machine. We *must* enforce strict client-side throttling (e.g., 1 request per second max).
- **UX:** Handling partial failures (5 domains worked, 2 failed).

## Notes

This feature risks abuse if not carefully gated or throttled.
