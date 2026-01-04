# Deep-Linkable Search State (The "Share" Engine)

**Category:** DX Improvement
**Quarter:** Q2
**T-shirt Size:** S

## Why This Matters

Currently, if a user finds an interesting result and refreshes the page, they lose their search. They cannot share a specific historical finding with a colleague. Making the URL the "source of truth" for state is a fundamental web best practice that is currently missing.

## Current State

- State is held in React `useState` (`searchUrl`, `selectedYear`).
- URL parameters are read once on mount but not updated during interaction.
- Refreshing the page resets filters.

## Proposed Future State

Every UI state change is reflected in the URL query parameters:
- `?url=example.com`
- `&from=2015&to=2020`
- `&filter=status:200`
- `&view=timeline`

This allows for "Share" buttons that simply copy the current URL, and enables perfect browser back/forward navigation.

## Key Deliverables

- [ ] Install `nuqs` (Next.js URL Query Strings) for type-safe URL state management.
- [ ] Refactor `useWaybackSearch` to consume props derived from URL params.
- [ ] Create a `ShareButton` component that copies the current URL to clipboard with a toast notification.
- [ ] Ensure "Back" button works correctly between search refinements.

## Prerequisites

- None.

## Risks & Open Questions

- **URL Length:** Extremely complex filters might hit URL length limits (rare for this use case).
- **SEO:** Need to ensure we don't generate infinite duplicate pages for search engines (use `canonical` tags).

## Notes

This is a high-impact, low-effort "Quick Win" identified in the original roadmap.
