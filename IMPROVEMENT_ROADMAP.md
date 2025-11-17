# TimeVault - Future Improvements Roadmap

This document outlines potential enhancements to improve the TimeVault application beyond the current performance optimizations.

## ✅ Completed Improvements

- **Client-Side Caching with SWR** - Automatic request deduplication and data persistence
- **Server-Side In-Memory Caching** - 24-hour TTL to reduce API load
- **Virtual Scrolling** - Efficient rendering of large result sets (up to 1000 snapshots)
- **Custom Hook Architecture** - Reusable `useWaybackSearch` hook for data fetching

## 🚀 High Priority Improvements

### 1. Shareable URLs (Quick Win)
**Effort:** Low | **Impact:** High

Add search parameters to the URL for bookmarking and sharing specific searches.

\`\`\`typescript
// Example: /?url=example.com&from=2020&to=2024
// Benefits:
// - Users can bookmark specific searches
// - Share exact searches with others
// - Better SEO and discovery
// - Browser back/forward navigation works correctly
\`\`\`

**Implementation:**
- Use Next.js router to sync URL params with search state
- Update URL when search is performed
- Read URL params on page load to restore search

### 2. Export Functionality
**Effort:** Low | **Impact:** Medium

Allow users to export search results to CSV or JSON.

**Features:**
- Export current filtered results
- Export all results
- Include metadata (timestamp, status, URL, size, mimetype)
- Format options: CSV, JSON
- Useful for researchers and data analysis

**Implementation:**
\`\`\`typescript
const exportToCSV = (snapshots: ArchiveResult[]) => {
  const csv = [
    ['Timestamp', 'URL', 'Status', 'MIME Type', 'Size'],
    ...snapshots.map(s => [s.timestamp, s.url, s.status, s.mimetype, s.length])
  ].map(row => row.join(',')).join('\n')

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `wayback-export-${Date.now()}.csv`
  a.click()
}
\`\`\`

### 3. Code Refactoring
**Effort:** Medium | **Impact:** High (Maintainability)

Extract additional business logic and create more custom hooks.

**Suggested structure:**
\`\`\`
lib/
  hooks/
    useWaybackSearch.ts ✅ (Done)
    useSearchHistory.ts (New)
    useTheme.ts (New)
    useKeyboardShortcuts.ts (New)
  wayback/
    formatting.ts (Date/byte formatters)
    statistics.ts (calculateStats)
    grouping.ts (groupSnapshotsByDate)
    types.ts (TypeScript interfaces)
    filters.ts (Filter logic)
\`\`\`

### 4. Advanced Keyboard Shortcuts
**Effort:** Low | **Impact:** Medium

Enhance productivity with more keyboard shortcuts.

**Shortcuts to add:**
- `n` / `p` - Next/Previous snapshot
- `e` - Export results
- `c` - Clear filters
- `?` - Show keyboard shortcuts help modal
- `Enter` on history item - Quick search
- `Ctrl/Cmd + Enter` - Search in new tab

## 💡 Feature Enhancements

### 5. Visual Timeline Chart
**Effort:** Medium | **Impact:** High

Display a visual timeline showing snapshot frequency over time.

**Features:**
- Bar chart or line graph showing snapshots per month/year
- Click on chart to filter by date range
- Color-coded by HTTP status (green = 200, red = 4xx/5xx)
- Identify periods of high/low archival activity

**Libraries:** Recharts or Chart.js

### 6. URL Validation & Smart Suggestions
**Effort:** Low | **Impact:** Medium

Improve UX with URL validation and suggestions.

**Features:**
- Real-time URL validation
- Suggest "Did you mean?" for common typos
- Check if URL was ever archived before search
- Auto-complete from search history
- Warn about URLs with no archives

### 7. Snapshot Comparison View
**Effort:** High | **Impact:** Medium

Side-by-side comparison of two snapshots.

**Features:**
- Select two snapshots to compare
- Split-screen iframe view
- Highlight differences (if possible)
- Useful for tracking website changes
- Show time elapsed between snapshots

### 8. Favorites / Bookmarks
**Effort:** Low | **Impact:** Medium

Save frequently checked URLs for quick access.

**Features:**
- Star/favorite URLs
- Store in localStorage or database
- Quick access sidebar or dropdown
- Add notes/tags to favorites
- Export/import favorites list

### 9. Batch URL Search
**Effort:** Medium | **Impact:** Medium

Check multiple URLs at once.

**Features:**
- Upload CSV of URLs
- Process in parallel (with rate limiting)
- Download combined results
- Progress indicator for batch operations
- Useful for researchers checking many sites

## 🔧 Technical Improvements

### 10. Enhanced Type Safety
**Effort:** Low | **Impact:** Medium (Code Quality)

Improve TypeScript usage across the codebase.

**Improvements:**
- Define strict types for Wayback API responses
- Use Zod for runtime validation of API responses
- Remove any `any` types
- Add proper error types
- Type guards for data validation

\`\`\`typescript
// Example with Zod
import { z } from 'zod'

const WaybackResponseSchema = z.array(
  z.tuple([
    z.string(), // timestamp
    z.string(), // url
    z.string(), // status
    z.string(), // mimetype
    z.string().optional(), // length
  ])
)

// Runtime validation
const data = WaybackResponseSchema.parse(response)
\`\`\`

### 11. Comprehensive Testing
**Effort:** High | **Impact:** High (Stability)

Add test coverage for critical functionality.

**Test types:**
- Unit tests for utility functions (formatters, calculators)
- Integration tests for API route
- E2E tests for critical user flows
- Visual regression tests for UI components

**Stack:** Vitest, React Testing Library, Playwright

### 12. Error Recovery & Retry Logic
**Effort:** Low | **Impact:** Medium

Improve error handling and user experience.

**Features:**
- Automatic retry for failed requests (with exponential backoff)
- Better error messages with actionable suggestions
- Fallback to direct Wayback API if proxy fails
- Network status detection
- Offline mode support (show cached results)

### 13. Enhanced Loading States
**Effort:** Low | **Impact:** Medium (UX)

Improve perceived performance with better loading indicators.

**Features:**
- Skeleton loaders instead of generic "Loading..."
- Progress indicator for long searches
- Optimistic UI updates
- Streaming results (if possible)
- Show partial results while loading

## 🗄️ Data & Analytics

### 14. Advanced Statistics Dashboard
**Effort:** Medium | **Impact:** Medium

Provide deeper insights into archive data.

**Metrics to add:**
- Crawl frequency analysis (average time between snapshots)
- Status code trends over time
- File size evolution
- Content type distribution pie chart
- Archive health score (based on success rate, frequency, etc.)
- Snapshot gap detection (large time periods with no archives)

### 15. Snapshot Change Detection
**Effort:** High | **Impact:** Medium

Detect and highlight significant changes between snapshots.

**Features:**
- Compare consecutive snapshots
- Detect major changes (content length, status code changes)
- Flag significant events (site went offline, major redesign)
- Visual indicators on timeline
- Useful for tracking website evolution

### 16. Search Analytics (with Database)
**Effort:** Medium | **Impact:** Low

Track popular searches and usage patterns.

**Features:**
- Most searched URLs
- Trending searches
- Search frequency graphs
- Popular time periods
- User engagement metrics

**Note:** Requires database and privacy considerations

## 🔐 Infrastructure & Backend

### 17. Rate Limiting
**Effort:** Low | **Impact:** High (Security)

Protect API endpoint from abuse.

**Implementation:**
\`\`\`typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// In API route
const { success } = await ratelimit.limit(ip)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
\`\`\`

### 18. Database Integration
**Effort:** High | **Impact:** High (Features)

Add persistent storage for advanced features.

**Use cases:**
- Store search results for faster subsequent searches
- User accounts and preferences
- Saved searches and favorites
- Search history across devices
- Analytics and trending data

**Stack:** PostgreSQL + Prisma, or Supabase

### 19. Background Jobs & Monitoring
**Effort:** High | **Impact:** Medium

Automated monitoring and notifications.

**Features:**
- Monitor specific URLs for new snapshots
- Email/webhook notifications
- Scheduled checks
- Snapshot availability tracking
- Useful for researchers tracking specific sites

**Stack:** Vercel Cron Jobs, Inngest, or similar

### 20. CDN & Global Performance
**Effort:** Medium | **Impact:** Medium

Improve global performance with CDN and edge caching.

**Improvements:**
- Edge caching for API responses
- Distribute cache across regions
- Use Vercel Edge Functions for API routes
- Optimize assets with CDN
- Geographic routing

## 📱 User Experience

### 21. Mobile Optimization
**Effort:** Medium | **Impact:** High

Enhance mobile experience.

**Improvements:**
- Touch-friendly controls
- Responsive virtual scrolling
- Mobile-specific keyboard shortcuts
- Pull-to-refresh
- Bottom sheet for filters on mobile
- Swipe gestures for navigation

### 22. Accessibility (a11y)
**Effort:** Medium | **Impact:** High

Ensure the app is accessible to all users.

**Improvements:**
- ARIA labels for all interactive elements
- Keyboard navigation throughout
- Screen reader support
- High contrast mode
- Focus indicators
- Skip to content links

### 23. Advanced Filtering
**Effort:** Medium | **Impact:** Medium

More powerful filtering options.

**Features:**
- Date range picker (beyond single year)
- Multiple status code selection
- Multiple MIME type selection
- File size filters (min/max)
- Regex search for URLs
- Saved filter presets

## 🎨 Polish & Quality of Life

### 24. Onboarding & Help
**Effort:** Low | **Impact:** Medium

Help new users understand the app.

**Features:**
- Interactive tutorial on first visit
- Contextual help tooltips
- Example searches
- FAQ section
- Video tutorials
- Changelog/What's new

### 25. Themes & Customization
**Effort:** Low | **Impact:** Low

Additional customization options.

**Features:**
- Custom color themes
- Font size adjustment
- Density options (compact/comfortable/spacious)
- Layout preferences (card view vs. table view)
- Persist preferences per device

### 26. Notification System
**Effort:** Medium | **Impact:** Low

In-app notifications for various events.

**Features:**
- Toast notifications for actions
- Export complete notifications
- Error notifications with retry
- Cache hit/miss indicators (dev mode)
- Success confirmations

## 📊 Implementation Priority Matrix

### Phase 1 - Quick Wins (1-2 weeks)
1. ✅ Performance optimizations (DONE)
2. Shareable URLs
3. Export functionality
4. Additional keyboard shortcuts
5. URL validation

### Phase 2 - Core Features (2-4 weeks)
1. Code refactoring (extract hooks and utilities)
2. Visual timeline chart
3. Enhanced error handling
4. Better type safety with Zod
5. Favorites/bookmarks

### Phase 3 - Advanced Features (1-2 months)
1. Comprehensive testing
2. Snapshot comparison
3. Advanced statistics dashboard
4. Mobile optimization
5. Accessibility improvements

### Phase 4 - Infrastructure (Ongoing)
1. Rate limiting
2. Database integration
3. Background jobs
4. CDN optimization
5. Monitoring and analytics

## 🤝 Contributing

When implementing these improvements:

1. **Follow existing patterns** - Use the established code structure
2. **Test thoroughly** - Add tests for new features
3. **Update documentation** - Keep this roadmap and README current
4. **Consider performance** - Don't regress on performance gains
5. **Mobile-first** - Ensure features work on all devices

## 📝 Notes

- Prioritize improvements based on user feedback
- Some features may require user accounts (database integration)
- Privacy should be a key consideration for any analytics
- Keep the app fast and lightweight - don't bloat it
- Regularly review and update this roadmap

---

**Last Updated:** 2024
**Contributors:** Claude Code Agent
