# Palette's Journal

## 2025-05-27 - Initial Setup
**Learning:** Found existing invalid HTML nesting (button inside anchor) in `SnapshotCard` which violates accessibility standards and HTML spec.
**Action:** Use `asChild` prop from Radix UI Slot utility when rendering Buttons as links to ensure semantic HTML.

## 2025-05-27 - Collapsible Patterns
**Learning:** Explicit instructions like "Click to expand" are less intuitive and more cluttered than standard patterns like a rotating chevron.
**Action:** Replace text instructions with `ChevronDown` icon that rotates on open state using `group-data-[state=open]` modifiers.
