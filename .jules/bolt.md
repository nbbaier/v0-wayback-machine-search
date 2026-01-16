## 2024-05-23 - [Debounce Filter]
**Learning:** Filtering large lists on every keystroke causes significant lag. Debouncing the filter input is a critical optimization for responsive UI.
**Action:** Always implement debouncing for search/filter inputs that trigger expensive re-renders or calculations.
## 2024-03-20 - Virtualized Table Performance\n**Learning:** When using `useWindowVirtualizer` with a table in a document flow (not a fixed container), you MUST set `scrollMargin` to the table's offset from the top of the document. Otherwise, the virtualizer assumes the list starts at 0 and renders items incorrectly (e.g., skipping the first N items if scrolled down).\n**Action:** Use a ref to measure the table's offset and update it on mount/resize.
