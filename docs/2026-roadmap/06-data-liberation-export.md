# "Data Liberation" Export Suite

**Category:** New Feature
**Quarter:** Q3
**T-shirt Size:** S

## Why This Matters

Researchers, SEO specialists, and data hoarders often use this tool as a starting point, but they need the data *outside* the browser to analyze it (e.g., in Excel, Python, or Tableau). Locking data in the UI limits the tool's utility for professional workflows.

## Current State

- Data is displayed in the UI.
- No download button.
- Copy-pasting from the table is tedious and badly formatted.

## Proposed Future State

A robust "Export" dropdown menu allowing users to download the current filtered dataset in multiple formats:
- **CSV:** For Excel/Google Sheets.
- **JSON:** For programmatic usage.
- **Markdown:** For documentation/notes.

## Key Deliverables

- [ ] Implement client-side CSV generation utility.
- [ ] Add `ExportButton` component to the `SearchHeader`.
- [ ] Include all metadata fields (Timestamp, Original URL, Status, MimeType, Length).
- [ ] Add ability to "Copy to Clipboard" as a quick alternative to file download.

## Prerequisites

- None.

## Risks & Open Questions

- **Large Datasets:** Generating a CSV for 100,000 snapshots might freeze the main thread.
- **Mitigation:** Use a Web Worker for generation or implement streaming download if we move to server-side generation.

## Notes

A low-hanging fruit that significantly increases the "Pro" feel of the application.
