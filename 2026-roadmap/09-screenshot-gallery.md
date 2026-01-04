# Automated Screenshot Gallery

**Category:** Visuals
**Quarter:** Q4
**T-shirt Size:** L

## Why This Matters

The Wayback Machine sometimes lacks thumbnails, or they are low quality. A "Grid of Thumbnails" is the most intuitive way to browse visual history ("I'm looking for the version with the blue header"). Generating our own reliable thumbnails enhances the browsing experience significantly.

## Current State

- We rely on `snapshot-preview.tsx` which likely just uses an iframe or generic placeholder.
- No thumbnail grid view.

## Proposed Future State

A server-side rendering service (using a headless browser like Puppeteer or Playwright) that:
1.  Takes a Wayback URL.
2.  Loads it in a sandboxed environment.
3.  Captures a screenshot.
4.  Stores it in object storage (AWS S3 / Vercel Blob).
5.  Serves it to the frontend.

## Key Deliverables

- [ ] Set up a separate service (or Vercel function with increased timeout) for screenshotting.
- [ ] Integrate Vercel Blob for storage.
- [ ] Update `Cards` view to use these high-res thumbnails.
- [ ] Implement "Lazy Generation" (only generate when a user scrolls to it).

## Prerequisites

- **Cost:** Running headless browsers is expensive/resource-intensive. Might need to limit this to a "Pro" tier or cap usage.

## Risks & Open Questions

- **Performance:** Screenshotting is slow (5-10s). It must be asynchronous.
- **Accuracy:** Wayback iframes often break assets, so screenshots might look broken.
- **Legal:** Is taking screenshots of archived content copyright infringement? (Likely fair use for search indexing, but gray area).

## Notes

This might be better solved by using an existing screenshot API (like ScreenshotOne or similar) to offload complexity, if budget permits.
