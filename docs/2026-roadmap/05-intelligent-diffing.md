# Intelligent Snapshot Diffing

**Category:** New Feature
**Quarter:** Q3
**T-shirt Size:** XL

## Why This Matters

The "Killer Feature" of a time machine is seeing *what changed*. "Why did our SEO ranking drop in 2018?" "When did they change the pricing?" Manually opening two tabs and squinting is tedious. Automated diffing provides immediate value to developers, marketers, and researchers.

## Current State

- No comparison functionality exists.
- Users must manually open links in new tabs.

## Proposed Future State

A "Compare Mode" where the user selects two snapshots (A and B). The system then:
1.  Fetches the HTML content of both snapshots (via a server-side proxy to avoid CORS).
2.  Sanitizes the HTML.
3.  Computes a "visual diff" or "text diff".
4.  Displays a side-by-side or overlay view highlighting added/removed text and DOM elements.

## Key Deliverables

- [ ] Create a new API route `/api/proxy-content` to fetch raw HTML from Wayback.
- [ ] Implement a text differencing library (e.g., `diff` or `jsdiff`).
- [ ] Build a `CompareInterface` UI (Split view pane).
- [ ] specific "Visual Diff" mode that highlights changes in the rendered output (green for additions, red for deletions).

## Prerequisites

- `01-cloud-native-architecture` (likely need a robust backend to handle the fetching/parsing of HTML, which might be too heavy for the client).

## Risks & Open Questions

- **CORS & Security:** Fetching arbitrary HTML and rendering it is risky (XSS). We must aggressively sanitize using `isomorphic-dompurify`.
- **Broken Assets:** Archived pages often have broken CSS/Images, making "Visual" diffs look broken. We might need to stick to "Text/Content" diffs initially.
- **Wayback Blocks:** The Wayback Machine might block aggressive scraping of page content.

## Notes

This is the most technically challenging feature on the roadmap but offers the highest differentiation.
