# Troubleshooting Guide

Common issues and solutions for TimeVault.

## Table of Contents

- [Search Issues](#search-issues)
- [Performance Issues](#performance-issues)
- [Display Issues](#display-issues)
- [Cache Issues](#cache-issues)
- [Browser Issues](#browser-issues)
- [Development Issues](#development-issues)
- [API Issues](#api-issues)

## Search Issues

### No Results Found

**Symptom:** Search completes but returns "No archives found"

**Common Causes:**
1. URL was never archived by the Wayback Machine
2. Incorrect URL format
3. Too restrictive filters

**Solutions:**

**Try different URL variations:**
\`\`\`
# If searching for:
www.example.com

# Try:
example.com
http://example.com
https://example.com
\`\`\`

**Check the Wayback Machine directly:**
1. Visit [web.archive.org](https://web.archive.org/)
2. Search for your URL there
3. If no results there, the URL was never archived

**Remove year filters:**
- Click any active year badges to deselect them
- Try searching without date restrictions first

**Try a more general URL:**
\`\`\`
# Instead of:
https://example.com/blog/2020/post-title

# Try:
https://example.com/blog
# Or even:
example.com
\`\`\`

### Search Taking Too Long

**Symptom:** Search hangs or takes more than 10 seconds

**Common Causes:**
1. Large result set (thousands of snapshots)
2. Slow CDX API response
3. Network issues
4. Server cold start (serverless)

**Solutions:**

**Use year filters to reduce result size:**
- Click a specific year (e.g., "2023") to limit results
- This speeds up both API response and rendering

**Check your internet connection:**
\`\`\`bash
# Test connectivity to Internet Archive
ping web.archive.org
\`\`\`

**Wait for cache to warm up:**
- First search may be slow (cold start)
- Subsequent identical searches will be instant (cached)

**Refresh the page:**
- Press Ctrl+R (Windows/Linux) or Cmd+R (Mac)
- Try the search again

### Search Returns Errors Only (404, 500)

**Symptom:** All results show red error badges (404, 500, etc.)

**Explanation:** This is normal! The Wayback Machine captured error states.

**What it means:**
- **404:** Page didn't exist when captured
- **500:** Server error when captured
- **301/302:** Page redirected when captured

**Solutions:**

**Filter by successful captures:**
1. Look for "Status:" section in Filter & Sort
2. Click the "200" badge
3. Only successful captures will show

**Check date range:**
- Site may have been offline during certain periods
- Try different years

**Try the domain root:**
\`\`\`
# Instead of specific page:
example.com/missing-page

# Try:
example.com
\`\`\`

## Performance Issues

### Slow Scrolling

**Symptom:** List stutters or lags when scrolling

**Common Causes:**
1. Too many browser tabs open
2. Browser extensions interfering
3. Insufficient RAM

**Solutions:**

**Close unnecessary tabs:**
- TimeVault uses virtual scrolling, but browser needs resources
- Close other tabs to free memory

**Disable browser extensions:**
1. Try incognito/private mode
2. If faster, disable extensions one by one to find culprit

**Use year filters:**
- Reduce result set to fewer than 500 items
- Improves overall performance

**Try a different browser:**
- Chrome/Edge: Best performance
- Firefox: Good performance
- Safari: Acceptable performance

### Filters Not Applying Instantly

**Symptom:** Delay when clicking filters

**This shouldn't happen.** Filters are client-side and should be instant.

**If experiencing delays:**

**Check browser console for errors:**
1. Press F12 to open DevTools
2. Click "Console" tab
3. Look for red error messages
4. Report these in a GitHub issue

**Clear browser cache:**
\`\`\`
Chrome: Ctrl+Shift+Del → Clear browsing data
Firefox: Ctrl+Shift+Del → Clear data
Safari: Cmd+Option+E
\`\`\`

**Reduce result size:**
- If you have 10,000+ results, filtering may slow down
- Use year filters to reduce dataset

### Page Freezes

**Symptom:** Entire page becomes unresponsive

**Common Causes:**
1. Browser out of memory
2. JavaScript error
3. Extremely large result set (edge case)

**Solutions:**

**Refresh the page:**
- Most reliable solution
- Press F5 or Ctrl+R

**Check DevTools console:**
1. If page is responsive enough, press F12
2. Check Console tab for errors
3. Report JavaScript errors on GitHub

**Reduce browser memory usage:**
- Close other tabs
- Restart browser
- Restart computer if needed

**Use year filters:**
- Don't try to display 10,000 results at once
- Narrow down by year first

## Display Issues

### Dark Mode Not Working

**Symptom:** Theme doesn't change or doesn't match system

**Solutions:**

**Check theme setting:**
1. Click theme button (top-right)
2. Ensure desired mode is selected
3. Try each option:
   - **Light:** Always light
   - **Dark:** Always dark
   - **System:** Matches OS setting

**Verify system dark mode:**
- **Windows:** Settings → Personalization → Colors
- **macOS:** System Preferences → General → Appearance
- **Linux:** Depends on desktop environment

**Clear localStorage:**
\`\`\`javascript
// Open browser console (F12) and run:
localStorage.removeItem('theme')
// Then refresh the page
\`\`\`

**Try a different browser:**
- Issue may be browser-specific
- Chrome, Firefox, Safari all supported

### Preview Not Loading

**Symptom:** Click "Preview" but modal is blank or shows error

**Common Causes:**
1. Wayback Machine server error
2. Page blocked from iframe embedding
3. Network issues

**Solutions:**

**Use "View" instead:**
- Click "View" button to open in new tab
- This bypasses iframe restrictions

**Check snapshot status:**
- Previews only work for successful captures (status 200)
- Error status codes (404, 500) may not preview well

**Try a different snapshot:**
- Some snapshots may be corrupted
- Try another snapshot from the same day or nearby dates

**Check browser console:**
1. Press F12
2. Look for errors like:
   - "Refused to display in a frame"
   - "Mixed content blocked"
3. These indicate iframe restrictions

### Statistics Not Showing

**Symptom:** Statistics card is missing or shows incorrect data

**Solutions:**

**Ensure search has completed:**
- Statistics only appear after results load
- Look for loading indicator

**Verify results exist:**
- Statistics require at least 1 snapshot
- Check that search returned results

**Refresh the page:**
- May be a rendering issue
- F5 or Ctrl+R to reload

**Check browser console:**
- Look for JavaScript errors
- Report on GitHub if found

### Keyboard Shortcuts Not Working

**Symptom:** Pressing `/` or `Cmd+K` doesn't work

**Solutions:**

**Ensure focus is not in an input:**
- Click elsewhere on the page first
- Shortcuts are disabled when typing in inputs

**Check for conflicting extensions:**
- Browser extensions may intercept keystrokes
- Try incognito/private mode

**Verify correct keys:**
- `/` for search focus (forward slash)
- `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) for history
- `Esc` to close modals

**Try clicking instead:**
- All shortcuts have UI equivalents
- Click search box directly
- Click theme button for theme menu

## Cache Issues

### Seeing Old Results

**Symptom:** Search returns outdated data

**Explanation:** TimeVault caches results for 24 hours (server) and 60 seconds (client).

**Solutions:**

**Wait for cache expiration:**
- Server cache: 24 hours
- Client cache: 60 seconds

**Force refresh on server:**
- Clear cache by restarting server (if self-hosting)
- On Vercel, wait for serverless function to restart

**Clear browser cache:**
\`\`\`
Chrome: Ctrl+Shift+Del
Firefox: Ctrl+Shift+Del
Safari: Cmd+Option+E
\`\`\`

**Use different year filter:**
- Different filters = different cache key
- Try adding/removing year filters

### Cache Hit/Miss Indicator

**How to check cache status:**

**Method 1: Browser DevTools**
1. Press F12 to open DevTools
2. Go to Network tab
3. Search for `/api/wayback`
4. Look for `X-Cache` header:
   - `HIT` = Cached response (fast)
   - `MISS` = Fresh fetch (slower)

**Method 2: Performance**
- Cached requests return in < 100ms
- Fresh requests take 1-5 seconds

**Expected behavior:**
- First search: `MISS` (2-5 seconds)
- Repeat within 60s: Instant (client cache)
- Repeat after 60s, within 24h: `HIT` (< 100ms)
- After 24h: `MISS` again

## Browser Issues

### Incompatible Browser

**Symptom:** Layout broken, features not working

**Minimum Requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Solutions:**

**Update your browser:**
- Chrome: Menu → Help → About Google Chrome
- Firefox: Menu → Help → About Firefox
- Safari: App Store → Updates

**Use a modern browser:**
- Download [Chrome](https://www.google.com/chrome/)
- Download [Firefox](https://www.mozilla.org/firefox/)

**Avoid Internet Explorer:**
- IE is not supported
- Use Edge instead (modern, built-in to Windows)

### Mobile Issues

**Symptom:** Issues on phone or tablet

**Solutions:**

**Use landscape mode:**
- Some features work better in landscape
- Rotate device for better experience

**Increase text size:**
- Use browser zoom
- Pinch to zoom works

**Try mobile browsers:**
- Chrome (Android/iOS)
- Safari (iOS)
- Firefox (Android/iOS)

**Simplify searches:**
- Use year filters to reduce results
- Smaller result sets work better on mobile

### Console Errors

**Symptom:** Red errors in browser console

**What to do:**

**Capture the error:**
1. Press F12
2. Click Console tab
3. Screenshot the error
4. Note what action caused it

**Report on GitHub:**
1. Go to project repository
2. Create new issue
3. Include:
   - Browser and version
   - Error message
   - Steps to reproduce
   - Screenshot

**Workaround:**
- Refresh page (F5)
- Try different browser
- Clear cache

## Development Issues

### npm install Fails

**Symptom:** Errors during `npm install`

**Solutions:**

**Check Node.js version:**
\`\`\`bash
node --version
# Should be 18.x or higher
\`\`\`

**Update npm:**
\`\`\`bash
npm install -g npm@latest
\`\`\`

**Clear npm cache:**
\`\`\`bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Try different package manager:**
\`\`\`bash
# Try pnpm
npm install -g pnpm
pnpm install

# Or yarn
npm install -g yarn
yarn install
\`\`\`

### Build Fails

**Symptom:** `npm run build` errors

**Solutions:**

**Check for TypeScript errors:**
\`\`\`bash
npm run build
# Read error messages carefully
\`\`\`

**Common TypeScript issues:**
- Missing type definitions
- Incorrect imports
- Type mismatches

**Clean build:**
\`\`\`bash
rm -rf .next
npm run build
\`\`\`

**Check environment:**
- Ensure Node.js 18+
- Ensure TypeScript is installed
- Check tsconfig.json is present

### Dev Server Won't Start

**Symptom:** `npm run dev` fails

**Solutions:**

**Check port 3000:**
\`\`\`bash
# Kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

**Use different port:**
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

**Check for errors:**
- Read console output carefully
- Look for missing dependencies
- Check for syntax errors

### TypeScript Errors

**Symptom:** Red squiggles in IDE

**Solutions:**

**Restart TypeScript server:**
- VSCode: Cmd+Shift+P → "Restart TypeScript Server"

**Check tsconfig.json:**
- Should be present in project root
- Ensure "strict": true is set correctly

**Install types:**
\`\`\`bash
npm install --save-dev @types/react @types/node
\`\`\`

**Verify imports:**
- Use `@/` for absolute imports
- Check paths in tsconfig.json

## API Issues

### 400 Bad Request

**Error:** `URL parameter is required`

**Cause:** Missing URL in search

**Solution:**
- Ensure you enter a URL before searching
- URL cannot be empty

### 500 Internal Server Error

**Error:** `Failed to fetch from Wayback Machine`

**Causes:**
1. Wayback Machine API is down
2. Network connectivity issue
3. Server error

**Solutions:**

**Check Wayback Machine status:**
- Visit [web.archive.org](https://web.archive.org/)
- If down, wait for Internet Archive to fix

**Check network:**
\`\`\`bash
ping web.archive.org
\`\`\`

**Wait and retry:**
- Temporary issues usually resolve in minutes
- Try again in 5-10 minutes

**Check server logs (if self-hosting):**
\`\`\`bash
# Look for error details
npm run dev
# Check console output
\`\`\`

### Rate Limiting

**Symptom:** Searches start failing after many requests

**Current Implementation:** No rate limiting (yet)

**Wayback Machine may rate limit:**
- If you make hundreds of requests quickly
- Use year filters to reduce API calls
- Rely on caching (24h server, 60s client)

**Solutions:**

**Wait a few minutes:**
- Rate limits typically reset quickly

**Use cache:**
- Repeated searches are cached
- No additional API calls

**Implement backoff:**
- Wait between searches
- Use filters to reduce requests

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**This shouldn't happen** - TimeVault uses a proxy to avoid CORS.

**If you see this:**

**Check API route:**
- Ensure `/api/wayback/route.ts` exists
- Verify it's being deployed

**Check URL:**
- Should call `/api/wayback`, not direct CDX API
- Check browser Network tab

**Report as bug:**
- This indicates a routing issue
- Open GitHub issue with details

## Getting Help

If these solutions don't resolve your issue:

### Before Asking for Help

**Gather information:**
1. Browser and version
2. Operating system
3. Exact error message
4. Steps to reproduce
5. Screenshot (if applicable)

**Try the basics:**
1. Refresh page (F5)
2. Clear cache
3. Try different browser
4. Check browser console

### Where to Get Help

**GitHub Issues:**
- Best for bugs and feature requests
- Provide detailed information
- Include error messages and screenshots

**Documentation:**
- [README.md](./README.md) - Getting started
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - How to use features
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| URL parameter is required | No URL provided | Enter a URL in search box |
| API request failed: 404 | URL not archived | Try different URL or no results exist |
| Failed to fetch | Network or API error | Check connection, retry later |
| Refused to display in a frame | Iframe blocked | Use "View" button instead of "Preview" |
| Rate limit exceeded | Too many requests | Wait and retry (future feature) |

---

**Still stuck?** Open an issue on GitHub with:
- Detailed description
- Error messages
- Steps to reproduce
- Browser/OS info
- Screenshots

We're here to help! 🚀
