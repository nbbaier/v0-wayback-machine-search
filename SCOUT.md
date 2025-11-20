# SCOUT.md - TimeVault Project Overview

**Last Updated:** November 19, 2025

## 🎯 Project Summary

**TimeVault** is a modern web interface for exploring the Internet Archive's Wayback Machine. It provides multiple viewing modes (cards, table, timeline) with advanced filtering, virtual scrolling for performance, and comprehensive caching.

## 🏗️ Architecture Overview

### Core Flow
```
User Input → useWaybackSearch Hook → /api/wayback → CDX API → Cached Response → Virtualized List
```

### Key Components
- **Main Entry:** `app/page.tsx` - Landing page with interface selection
- **Search Views:** `app/cards/`, `app/table/`, `app/timeline/` - Different viewing modes
- **API Proxy:** `app/api/wayback/route.ts` - Server-side caching proxy
- **Data Hook:** `lib/hooks/useWaybackSearch.ts` - SWR-powered data fetching
- **Performance:** `components/virtualized-snapshot-list.tsx` - Handles large datasets

## 📁 Project Structure

```
v0-wayback-machine-search/
├── app/                          # Next.js App Router
│   ├── api/wayback/             # API proxy with 24h server cache
│   ├── cards/                   # Card-based view (main interface)
│   ├── table/                   # Table view
│   ├── timeline/                # Timeline view
│   └── page.tsx                 # Landing page
├── components/
│   ├── search/                  # Search-specific components
│   ├── snapshot/                # Snapshot display components
│   ├── ui/                      # shadcn/ui components
│   └── virtualized-snapshot-list.tsx
├── lib/
│   ├── hooks/useWaybackSearch.ts # SWR hook (60s client cache)
│   ├── types/archive.ts         # TypeScript definitions
│   └── utils/formatters.ts      # Date/byte formatting
```

## 🚀 Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run Biome linter
pnpm lint:fix # Auto-fix linting issues
pnpm check    # Type check with Biome
```

## 🎯 Quick Start Tasks (When Resuming)

### 1. **Immediate Wins** (Start Here)
- **Shareable URLs:** Add URL query params to sync search state
- **Export Feature:** Add CSV/JSON download functionality
- **Keyboard Shortcuts:** Implement `/` for search focus, `Esc` for modals

### 2. **Performance & UX**
- **Error Boundaries:** Add proper error handling for API failures
- **Loading States:** Improve skeleton loading for better perceived performance
- **Mobile Optimization:** Test and fix responsive issues

### 3. **Feature Enhancements**
- **Search History:** Enhance the existing localStorage implementation
- **Advanced Filters:** Add more filtering options (file size, specific dates)
- **Bulk Operations:** Support searching multiple URLs

## 🔧 Key Technical Details

### Caching Strategy
- **Client:** SWR with 60s deduplication window
- **Server:** In-memory Map with 24h TTL
- **Cache Key:** Full CDX API URL

### Performance Optimizations
- **Virtual Scrolling:** Renders only visible items (~20 DOM nodes vs 1000+)
- **Request Deduplication:** Prevents duplicate API calls
- **Lazy Cleanup:** Server cache cleanup only when needed

### State Management
- **Local:** React useState for UI state
- **Global:** SWR cache for API data
- **Persistent:** localStorage for search history & theme

## 🧪 Testing Approach

Currently no test runner configured. When adding tests:
- **Unit:** Test formatters and utility functions
- **Integration:** Test API route and data transformation
- **E2E:** Test search flows and filtering

## 📊 Current Status

✅ **Completed:**
- Basic search functionality
- Three viewing modes (cards, table, timeline)
- Virtual scrolling implementation
- Server and client-side caching
- Dark mode support
- Statistics dashboard

🔄 **In Progress:**
- URL state synchronization (shareable URLs)
- Enhanced error handling
- Mobile responsiveness improvements

📋 **Next Priority:**
1. Implement shareable URLs (high impact, low effort)
2. Add export functionality
3. Improve error boundaries
4. Enhanced keyboard shortcuts

## 🔗 Key Files to Understand

1. **`lib/hooks/useWaybackSearch.ts`** - Core data fetching logic
2. **`app/api/wayback/route.ts`** - Server-side caching implementation
3. **`components/virtualized-snapshot-list.tsx`** - Performance optimization
4. **`app/cards/page.tsx`** - Main search interface (most active development)

## 💡 Development Tips

- **Start Small:** Pick one feature from the roadmap and implement it fully
- **Test Performance:** Use large websites (like `cnn.com`) to test virtual scrolling
- **Cache Testing:** Clear browser cache and server cache when debugging
- **API Limits:** Be mindful of Wayback Machine rate limits during development
- **Type Safety:** Use the existing TypeScript interfaces in `lib/types/archive.ts`

## 📚 Additional Documentation

- **`ARCHITECTURE.md`** - Detailed technical architecture
- **`IMPROVEMENT_ROADMAP.md`** - Prioritized feature list
- **`API_DOCUMENTATION.md`** - API endpoint documentation
- **`TROUBLESHOOTING.md`** - Common issues and solutions