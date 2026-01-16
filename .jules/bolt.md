## 2025-05-23 - Search Filtering Performance
**Learning:** The application performs expensive synchronous filtering and grouping on potentially large datasets (Wayback Machine snapshots) directly in the render cycle. This blocks the main thread and causes input lag.
**Action:** Always look for filter/search inputs coupled with `useMemo` logic. Apply `useDeferredValue` to the filter state to separate the UI update (input typing) from the expensive list processing.
