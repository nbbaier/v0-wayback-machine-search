## 2024-05-22 - Invalid Button Nesting
**Learning:** Found `<a>` wrapping `<Button>` in `SnapshotCard`, causing invalid HTML and potential accessibility issues. The `Button` component supports `asChild`, allowing correct semantic nesting.
**Action:** Use `asChild` prop on `Button` components when they serve as links, placing the `<a>` tag inside.
