# TimeVault - Modern Wayback Machine Search

> A fast, modern interface for exploring the Internet Archive's Wayback Machine with advanced filtering, statistics, and an elegant user experience.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nbbaiers-projects/v0-wayback-machine-search)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/WbV9AcLdp5N)

## Overview

TimeVault is a powerful web application that lets you search through billions of archived web pages from the Internet Archive's Wayback Machine. With an intuitive interface, performance optimizations, and advanced filtering capabilities, TimeVault makes exploring web history effortless.

**Live Demo:** [https://vercel.com/nbbaiers-projects/v0-wayback-machine-search](https://vercel.com/nbbaiers-projects/v0-wayback-machine-search)

## Features

### Core Functionality
- **Smart Search** - Search any URL to discover its archived snapshots
- **Year Filtering** - Quick filter buttons for years 2020-2025
- **Search History** - Automatic history tracking with local storage (last 10 searches)
- **Advanced Filtering** - Filter by status code, MIME type, or custom text
- **Sort Options** - View snapshots newest-first or oldest-first
- **Snapshot Preview** - In-app preview of archived pages via iframe

### Performance & UX
- **Virtual Scrolling** - Smoothly handle thousands of results with `@tanstack/react-virtual`
- **Client-Side Caching** - SWR-powered caching with 60s deduplication interval
- **Server-Side Caching** - 24-hour in-memory cache to reduce API load
- **Keyboard Shortcuts** - Power-user features for faster navigation
- **Dark Mode** - Full theme support (Light/Dark/System)
- **Responsive Design** - Works seamlessly on desktop and mobile

### Statistics Dashboard
View comprehensive analytics for each search:
- Total snapshots found
- Success rate (HTTP 200 responses)
- Average file size
- Date range coverage
- Top status codes and content types

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Data Fetching:** [SWR](https://swr.vercel.app/)
- **Virtualization:** [@tanstack/react-virtual](https://tanstack.com/virtual)
- **External API:** [Wayback Machine CDX Server](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server)

## Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nbbaier/v0-wayback-machine-search.git
cd v0-wayback-machine-search
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Search
1. Enter a URL in the search box (e.g., `example.com` or `https://example.com`)
2. Click "Search" or press Enter
3. Browse the archived snapshots grouped by date

### Quick Filters
- Click year badges (2020-2025) to filter results to specific years
- Use status code badges to filter by HTTP response codes
- Use content type badges to filter by MIME types

### Keyboard Shortcuts
- `/` - Focus search input
- `⌘K` / `Ctrl+K` - Toggle search history
- `Esc` - Close modals or blur search input

### Advanced Filtering
- Use the text filter to search within snapshot URLs or timestamps
- Combine multiple filters for precise results
- Toggle between newest-first and oldest-first sorting

## Project Structure

```
v0-wayback-machine-search/
├── app/
│   ├── api/wayback/      # API route (proxies Wayback CDX API)
│   ├── page.tsx          # Main search interface
│   ├── layout.tsx        # Root layout
│   └── loading.tsx       # Loading state
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── virtualized-snapshot-list.tsx  # Optimized list rendering
│   ├── theme-provider.tsx
│   └── providers.tsx
├── lib/
│   ├── hooks/
│   │   └── useWaybackSearch.ts  # SWR-powered search hook
│   └── utils/
│       └── formatters.ts        # Date and byte formatters
├── styles/               # Global styles
└── public/              # Static assets
```

## How It Works

1. **User Input** → User enters a URL and optional filters
2. **Hook** → `useWaybackSearch` hook constructs API request
3. **API Route** → `/api/wayback` proxies request to Wayback CDX Server
4. **Caching** → Response cached server-side (24h) and client-side (SWR)
5. **Display** → Results rendered with virtual scrolling for performance

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

For ideas on what to work on, check out the [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md).

## Roadmap

See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md) for a comprehensive list of planned improvements and features.

**High-priority upcoming features:**
- Shareable URLs with query parameters
- Export functionality (CSV/JSON)
- Visual timeline chart
- Enhanced keyboard shortcuts
- Code refactoring and additional custom hooks

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Internet Archive** - For maintaining the incredible [Wayback Machine](https://web.archive.org/)
- **v0.app** - For the initial project scaffold and deployment integration
- **Vercel** - For hosting and seamless deployments

## Support

If you encounter any issues or have questions:
- Check the [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed usage instructions
- Review existing issues on GitHub
- Create a new issue with details about your problem

---

**Built with ❤️ using Next.js and the Internet Archive's Wayback Machine API**
