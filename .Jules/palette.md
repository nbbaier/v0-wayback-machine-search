# Palette's Journal

## 2026-06-25 - Invalid Nesting in SnapshotCard
**Learning:** Found a `<Button>` nested inside an `<a>` tag, which creates invalid HTML (`<a href...><button...></button></a>`). This is a common accessibility issue.
**Action:** Used the `asChild` prop on the Radix UI `Button` component to correctly render the anchor tag with button styles (`<Button asChild><a href...>...</a></Button>`), ensuring valid HTML and proper accessibility semantics.

## 2025-05-27 - Initial Setup
**Learning:** Found existing invalid HTML nesting (button inside anchor) in `SnapshotCard` which violates accessibility standards and HTML spec.
**Action:** Use `asChild` prop from Radix UI Slot utility when rendering Buttons as links to ensure semantic HTML.

## 2025-05-27 - Collapsible Patterns
**Learning:** Explicit instructions like "Click to expand" are less intuitive and more cluttered than standard patterns like a rotating chevron.
**Action:** Replace text instructions with `ChevronDown` icon that rotates on open state using `group-data-[state=open]` modifiers.

## 2024-05-22 - Explicit Text vs Standard Iconography
**Learning:** Users often scan UI elements. Explicit instructions like "Click to expand" can feel cluttered. Replacing them with standard affordances (like a chevron) reduces cognitive load while maintaining discoverability.
**Action:** Prefer standard icons (arrows, chevrons) over text instructions for common interactions like expanding/collapsing, unless the interaction is non-standard.
