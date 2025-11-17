# TimeVault - Usage Guide

Complete guide to using TimeVault for exploring archived web pages from the Wayback Machine.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Search](#basic-search)
- [Understanding Results](#understanding-results)
- [Filtering & Sorting](#filtering--sorting)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Features Deep Dive](#features-deep-dive)
- [Tips & Best Practices](#tips--best-practices)
- [Common Use Cases](#common-use-cases)
- [FAQ](#faq)

## Getting Started

### Accessing TimeVault

TimeVault is a web application - simply open it in your browser. No installation or account required.

**Live Demo:** [https://vercel.com/nbbaiers-projects/v0-wayback-machine-search](https://vercel.com/nbbaiers-projects/v0-wayback-machine-search)

### Your First Search

1. Look for the search box in the center of the page
2. Enter a website URL (e.g., `example.com` or `https://example.com`)
3. Press Enter or click the "Search" button
4. Wait a few seconds while TimeVault fetches archived snapshots

**Note:** You don't need to include `http://` or `https://` - TimeVault will add it automatically.

## Basic Search

### Entering URLs

TimeVault accepts URLs in multiple formats:

**Valid formats:**
- `example.com`
- `www.example.com`
- `https://example.com`
- `http://example.com/page`
- `subdomain.example.com`

**Examples:**
```
github.com
www.nytimes.com
https://docs.python.org
old-website.com/blog
```

### Quick Year Filters

After entering a URL, you can filter by specific years using the quick filter badges:

- Click any year badge (2020, 2021, 2022, 2023, 2024, 2025)
- Only snapshots from that year will be included
- Click again to remove the filter

**Use Case:** Want to see how a website looked in 2020? Enter the URL and click the "2020" badge.

## Understanding Results

### Results Overview

After searching, you'll see:

1. **Statistics Card** - Overview of all snapshots found
2. **Filter & Sort Controls** - Refine your results
3. **Snapshot List** - Grouped by date, with details for each snapshot

### Statistics Dashboard

The statistics card shows:

- **Total Snapshots** - How many archived versions were found
- **Success Rate** - Percentage of successful captures (HTTP 200)
- **Average Size** - Mean file size of snapshots
- **Date Range** - First and last snapshot dates
- **Status Codes** - Distribution of HTTP response codes
- **Content Types** - Most common MIME types

**Example:**
```
Total Snapshots: 1,234
Success Rate: 87%
Avg Size: 145 KB
Date Range: Jan 1, 2020 - Dec 31, 2024
```

### Snapshot Details

Each snapshot shows:

- **Date** - When the page was archived
- **Time** - Exact timestamp (HH:MM:SS)
- **Status Code** - HTTP response (200, 404, 301, etc.)
- **Content Type** - MIME type (text/html, image/jpeg, etc.)
- **Size** - File size in bytes/KB/MB
- **Actions** - Preview or open in new tab

### HTTP Status Codes

Common status codes you'll encounter:

- **200** - Success (page captured successfully)
- **301** - Permanent redirect
- **302** - Temporary redirect
- **404** - Not found
- **500** - Server error

**Green badges** = Success
**Yellow badges** = Redirects
**Red badges** = Errors

## Filtering & Sorting

### Text Filter

Use the text filter to search within results:

**Search by:**
- URL fragments (e.g., `/blog` to find blog pages)
- Timestamp patterns (e.g., `2023` to find 2023 snapshots)
- Any text in the snapshot URL

**Example:** Searching for `api` will show only snapshots with "api" in the URL.

### Status Code Filter

Filter by HTTP response code:

1. Look for the "Status:" section in the Filter & Sort card
2. Click any status code badge (200, 404, 301, etc.)
3. Only snapshots with that status will show

**Use Case:** Click "200" to see only successful captures, hiding errors and redirects.

### MIME Type Filter

Filter by content type:

1. Look for the "Type:" section in the Filter & Sort card
2. Click any MIME type badge (text/html, image/jpeg, etc.)
3. Only snapshots of that type will show

**Use Cases:**
- `text/html` - Web pages
- `application/pdf` - PDF documents
- `image/jpeg` - Images
- `text/css` - Stylesheets
- `application/json` - JSON data

### Sorting

Toggle between two sort orders:

- **Newest First** - Most recent snapshots at the top (default)
- **Oldest First** - Oldest snapshots at the top

**Tip:** Use "Oldest First" to see the very first version of a website.

### Combining Filters

You can combine multiple filters for precise results:

**Example:**
1. Filter by year: Click "2022"
2. Filter by status: Click "200"
3. Filter by type: Click "text/html"
4. Add text filter: Type "/blog"

**Result:** Only successful HTML blog pages from 2022.

## Keyboard Shortcuts

TimeVault includes keyboard shortcuts for power users:

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search input |
| `⌘K` or `Ctrl+K` | Toggle search history |
| `Esc` | Close modals or blur input |
| `Enter` | Execute search (when in search box) |

### Tips for Shortcuts

- Press `/` from anywhere to quickly start a new search
- Use `⌘K` to access your recent searches instantly
- Press `Esc` to quickly dismiss the search history or preview modal

## Features Deep Dive

### Search History

TimeVault automatically saves your last 10 searches:

**Features:**
- Stored locally in your browser (private)
- Click any history item to search again
- Remove individual items with the X button
- Clear all history with "Clear All"

**Accessing History:**
1. Click the search box
2. History appears automatically (if you have any)
3. Or press `⌘K` / `Ctrl+K` from anywhere

**Privacy:** History is stored only in your browser and never sent to any server.

### Snapshot Preview

Preview archived pages without leaving TimeVault:

**How to preview:**
1. Find a snapshot in the results
2. Click the "Preview" button (eye icon)
3. View the snapshot in a modal iframe
4. Click "Open in New Tab" to visit the full Wayback Machine page

**What you'll see:**
- The archived page rendered in an iframe
- Snapshot metadata (status, type, size)
- Direct link to open in Wayback Machine

**Limitations:**
- Some pages may not render properly in iframes
- Interactive features may not work
- External resources might not load

### Dark Mode

TimeVault supports three theme modes:

**Modes:**
- **Light** - Bright theme for daytime use
- **Dark** - Dark theme to reduce eye strain
- **System** - Automatically matches your OS preference

**Changing themes:**
1. Click the theme button in the top-right corner
2. Select your preferred mode
3. Your choice is saved and persists across sessions

### Virtual Scrolling

TimeVault uses virtual scrolling to handle large result sets efficiently:

**Benefits:**
- Smoothly display thousands of snapshots
- No lag or performance issues
- Instant filtering and sorting
- Low memory usage

**What is virtual scrolling?**
Only visible snapshots are rendered in the DOM. As you scroll, snapshots are added/removed dynamically. This keeps the page fast even with 10,000+ results.

## Tips & Best Practices

### Getting Better Results

**Use specific URLs:**
```
Good: github.com/torvalds/linux
Better: github.com/torvalds/linux/commits
```

**Try different URL variations:**
- With/without `www`
- HTTP vs HTTPS
- Different subdomains

**Check multiple years:**
- Some websites have sparse archival coverage
- Try different year filters to find snapshots

### Performance Tips

**For large result sets:**
1. Use year filters to reduce results
2. Filter by status code (200 for successful pages only)
3. Use text filter to narrow down specific pages

**Browser performance:**
- Virtual scrolling handles thousands of results smoothly
- Filters are applied instantly (no API calls)
- Results are cached for 60 seconds

### Research Workflows

**Tracking website changes:**
1. Search for the URL
2. Sort by "Oldest First"
3. Open first and last snapshots in new tabs
4. Compare side-by-side

**Finding specific content:**
1. Search for the domain
2. Use text filter with page path (e.g., `/articles`)
3. Filter by successful status (200)
4. Browse by date to find the right version

**Bulk exploration:**
1. Search without year filter to see all snapshots
2. Check statistics for coverage gaps
3. Use filters to explore different content types

## Common Use Cases

### Academic Research

**Finding historical sources:**
```
1. Search: old-news-site.com/archives
2. Filter: Year 2015, Status 200
3. Sort: Oldest First
4. Preview snapshots to find relevant articles
```

### Web Development

**Checking old designs:**
```
1. Search: competitor-site.com
2. Filter: Year 2018, Type text/html
3. Preview snapshots to study design evolution
```

### Digital Archaeology

**Recovering lost content:**
```
1. Search: defunct-website.com
2. Filter: Status 200 (ignore errors)
3. Sort: Newest First (last working version)
4. Export results for archival
```

### Legal/Compliance

**Evidence gathering:**
```
1. Search: specific-page.com/terms
2. Note: Statistics show date range
3. Export: Use browser print/save (export feature coming soon)
```

## FAQ

### General Questions

**Q: What is the Wayback Machine?**
A: A digital archive of the World Wide Web maintained by the Internet Archive. It has archived billions of web pages since 1996.

**Q: Is TimeVault free to use?**
A: Yes, completely free. It's a frontend for the Internet Archive's public API.

**Q: Do I need an account?**
A: No, TimeVault works without any registration or login.

### Search & Results

**Q: Why doesn't my search return any results?**
A: Possible reasons:
- The URL was never archived by the Wayback Machine
- The URL might be spelled incorrectly
- Try different URL variations (with/without www, different protocols)

**Q: How often are websites archived?**
A: It varies. Popular sites may be archived daily, while others are captured sporadically or never. The Internet Archive crawls the web automatically.

**Q: Can I request a website to be archived?**
A: Yes, use the [Wayback Machine's "Save Page Now" feature](https://web.archive.org/save) to archive a page immediately.

**Q: Why are some snapshots showing errors (404, 500)?**
A: These indicate the page was unavailable or broken when the Wayback Machine tried to archive it. Filter by status 200 to see successful captures only.

### Performance

**Q: Why is my search slow?**
A: First searches may take 5-10 seconds. Subsequent searches for the same URL are cached and load instantly. Very large result sets (10,000+) may take longer.

**Q: Can I search multiple URLs at once?**
A: Not currently, but this feature is planned. See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md).

### Data & Privacy

**Q: Is my search history private?**
A: Yes, search history is stored only in your browser's local storage. It's never sent to any server.

**Q: Can I export search results?**
A: Export functionality is coming soon. See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md).

**Q: How long are results cached?**
A: Client-side: SWR caches for 60 seconds. Server-side: 24 hours for the same query.

### Technical

**Q: What browsers are supported?**
A: All modern browsers (Chrome, Firefox, Safari, Edge). Mobile browsers are fully supported.

**Q: Can I self-host TimeVault?**
A: Yes, it's open source. See [README.md](./README.md) for installation instructions.

**Q: Does TimeVault work offline?**
A: No, it requires an internet connection to fetch data from the Wayback Machine API.

## Troubleshooting

### No Results Found

**Solutions:**
1. Check URL spelling
2. Try without `www` or vice versa
3. Try `http://` instead of `https://`
4. Remove specific pages (try domain root first)

### Preview Not Loading

**Solutions:**
1. Click "Open in New Tab" instead
2. Some sites block iframe embedding
3. Try a different snapshot

### Slow Performance

**Solutions:**
1. Clear your browser cache
2. Use year filters to reduce results
3. Try a different browser
4. Check your internet connection

## Getting Help

If you encounter issues not covered here:

1. Check the [README.md](./README.md)
2. Review [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md)
3. Open an issue on GitHub with details

---

**Happy exploring! 🕰️**
