# "Universal Access" Overhaul

**Category:** Accessibility
**Quarter:** Q4
**T-shirt Size:** M

## Why This Matters

The Internet Archive is a library, and libraries must be accessible to everyone. Currently, complex data tables and timeline visualizations can be nightmares for screen reader users. Ensuring WCAG 2.1 AA compliance aligns with the mission of preserving knowledge for *all*.

## Current State

- Basic accessibility via Radix UI (good foundation).
- Timeline and charts likely have poor keyboard/screen reader support.
- Color contrast in "Dark Mode" might be unverified.

## Proposed Future State

- Full keyboard navigation for the timeline (arrow keys to move between years).
- "Skip to Content" links.
- ARIA labels describing the density of snapshots in the charts.
- Verified color contrast ratios for all text/badges.
- Reduced Motion support for the animations.

## Key Deliverables

- [ ] Audit with Axe DevTools / Lighthouse.
- [ ] Implement `aria-label` and `role` attributes on the `TimelineGroup`.
- [ ] Fix tab index order.
- [ ] Ensure the "Visual Analytics" charts have tabular fallbacks for screen readers.

## Prerequisites

- None.

## Risks & Open Questions

- **Complexity:** Making data visualizations accessible is notoriously difficult.

## Notes

This isn't just "nice to have"—it's often a legal requirement and always an ethical one.
