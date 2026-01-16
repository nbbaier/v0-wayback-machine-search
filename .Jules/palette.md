# Palette's Journal

## 2026-06-25 - Invalid Nesting in SnapshotCard
**Learning:** Found a `<Button>` nested inside an `<a>` tag, which creates invalid HTML (`<a href...><button...></button></a>`). This is a common accessibility issue.
**Action:** Used the `asChild` prop on the Radix UI `Button` component to correctly render the anchor tag with button styles (`<Button asChild><a href...>...</a></Button>`), ensuring valid HTML and proper accessibility semantics.
