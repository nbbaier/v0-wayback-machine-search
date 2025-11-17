# API Documentation

Complete documentation for TimeVault's internal API and external integrations.

## Table of Contents

- [Overview](#overview)
- [Internal API](#internal-api)
- [Wayback Machine CDX API](#wayback-machine-cdx-api)
- [Caching Strategy](#caching-strategy)
- [Error Handling](#error-handling)
- [Response Format](#response-format)
- [Examples](#examples)

## Overview

TimeVault uses a Next.js API route (`/api/wayback`) as a proxy to the Internet Archive's Wayback Machine CDX Server API. This proxy layer provides:

- **CORS handling** - Avoids cross-origin issues
- **Server-side caching** - Reduces load on Wayback Machine API
- **Request normalization** - Consistent interface for the frontend
- **Error handling** - Graceful degradation and clear error messages

## Internal API

### Endpoint

```
GET /api/wayback
```

### Base URL

```
https://your-deployment-url.vercel.app/api/wayback
```

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `url` | string | Yes | The URL to search for in the archive | `example.com` |
| `from` | string | No | Start year (YYYY format) | `2020` |
| `to` | string | No | End year (YYYY format) | `2024` |

**Notes:**
- The `url` parameter accepts URLs with or without protocol (`http://`, `https://`)
- Year filters use YYYY format and are passed directly to the CDX API
- Results are limited to 1000 snapshots (configurable in the code)

### Request Headers

No special headers required. Standard HTTP GET request.

### Response Headers

| Header | Value | Description |
|--------|-------|-------------|
| `Content-Type` | `application/json` | Response is JSON |
| `X-Cache` | `HIT` or `MISS` | Indicates if response came from cache |

### Response Format

#### Success Response (200 OK)

```json
[
  [
    "timestamp",
    "original",
    "statuscode",
    "mimetype",
    "length"
  ],
  [
    "20240115120000",
    "https://example.com/",
    "200",
    "text/html",
    "12345"
  ],
  [
    "20240116083000",
    "https://example.com/",
    "200",
    "text/html",
    "12456"
  ]
]
```

**Response Structure:**
- First array element is the header row (field names)
- Subsequent elements are snapshot data rows
- Empty result set returns `[["timestamp", "original", "statuscode", "mimetype", "length"]]`

**Field Descriptions:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `timestamp` | string | Capture time in YYYYMMDDHHmmss format | `20240115120000` |
| `original` | string | Original URL that was archived | `https://example.com/` |
| `statuscode` | string | HTTP status code | `200`, `404`, `301` |
| `mimetype` | string | MIME type of the content | `text/html`, `image/jpeg` |
| `length` | string | Content length in bytes (optional) | `12345` |

#### Error Responses

**400 Bad Request** - Missing required parameter
```json
{
  "error": "URL parameter is required"
}
```

**500 Internal Server Error** - CDX API failure
```json
{
  "error": "Failed to fetch from Wayback Machine"
}
```

**502 Bad Gateway** - CDX API returns error
```json
{
  "error": "Wayback Machine API error: 503"
}
```

## Wayback Machine CDX API

TimeVault proxies requests to the Internet Archive's CDX Server API.

### CDX API Endpoint

```
https://web.archive.org/cdx/search/cdx
```

### Parameters Used

TimeVault forwards the following parameters to the CDX API:

| Parameter | Value | Description |
|-----------|-------|-------------|
| `url` | User-provided | URL to search for |
| `output` | `json` | Response format |
| `fl` | `timestamp,original,statuscode,mimetype,length` | Fields to return |
| `from` | User-provided (optional) | Start year |
| `to` | User-provided (optional) | End year |
| `limit` | `1000` | Maximum results to return |

### Example CDX Request

```
https://web.archive.org/cdx/search/cdx?url=example.com&output=json&fl=timestamp,original,statuscode,mimetype,length&from=2020&to=2024&limit=1000
```

### CDX API Documentation

For complete CDX API documentation, see:
- [Wayback CDX Server API](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server)
- [CDX File Format](https://archive.org/web/researcher/cdx_file_format.php)

## Caching Strategy

TimeVault implements a two-tier caching strategy for optimal performance.

### Server-Side Cache (Level 1)

**Implementation:** In-memory Map in the API route

**Configuration:**
- **TTL:** 24 hours
- **Key:** Full CDX API URL (including all parameters)
- **Storage:** Node.js process memory
- **Cleanup:** Lazy cleanup on each request

**Cache Structure:**
```typescript
interface CacheEntry {
  data: string[][]      // CDX API response
  timestamp: number     // Cache creation time
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
```

**Behavior:**
- Cache hit returns cached data with `X-Cache: HIT` header
- Cache miss fetches from CDX API and stores result
- Expired entries are removed lazily on subsequent requests

**Limitations:**
- Memory-based (cleared on server restart)
- Not shared across serverless function instances
- Limited by available memory

### Client-Side Cache (Level 2)

**Implementation:** SWR (stale-while-revalidate)

**Configuration:**
```typescript
{
  revalidateOnFocus: false,       // Don't refetch on window focus
  revalidateOnReconnect: false,   // Don't refetch on reconnect
  dedupingInterval: 60000,        // Dedupe requests within 60s
  keepPreviousData: true          // Show old data while loading new
}
```

**Behavior:**
- Deduplicates identical requests within 60 seconds
- Maintains previous data during revalidation
- Persists across component remounts (within same session)

**Benefits:**
- Instant results for repeated searches
- Reduced API calls
- Better user experience with stale-while-revalidate pattern

### Cache Invalidation

**Server-side:**
- Automatic expiration after 24 hours
- Manual cache clear requires server restart

**Client-side:**
- New search parameters trigger new request
- Page refresh clears SWR cache
- Manual invalidation via SWR `mutate` function

## Error Handling

### Network Errors

**Scenario:** CDX API unreachable

**Response:**
```json
{
  "error": "Failed to fetch from Wayback Machine"
}
```

**HTTP Status:** 500

**Client Behavior:**
- SWR automatically retries failed requests
- Error state displayed to user
- Previous data maintained if available

### Validation Errors

**Scenario:** Missing URL parameter

**Response:**
```json
{
  "error": "URL parameter is required"
}
```

**HTTP Status:** 400

**Client Behavior:**
- Error state displayed
- User prompted to enter URL

### API Errors

**Scenario:** CDX API returns non-200 status

**Response:**
```json
{
  "error": "Wayback Machine API error: 503"
}
```

**HTTP Status:** Same as CDX API

**Common CDX API Errors:**
- **503 Service Unavailable** - CDX server overloaded
- **404 Not Found** - URL never archived (returns empty array instead)
- **400 Bad Request** - Invalid parameters

## Response Format

### Timestamp Format

CDX timestamps use the format: `YYYYMMDDHHmmss`

**Example:** `20240115120000`
- Year: 2024
- Month: 01 (January)
- Day: 15
- Hour: 12 (noon UTC)
- Minute: 00
- Second: 00

**Parsing in JavaScript:**
```javascript
const timestamp = "20240115120000"
const year = timestamp.slice(0, 4)    // "2024"
const month = timestamp.slice(4, 6)   // "01"
const day = timestamp.slice(6, 8)     // "15"
const hour = timestamp.slice(8, 10)   // "12"
const minute = timestamp.slice(10, 12) // "00"
const second = timestamp.slice(12, 14) // "00"

const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`)
```

### Wayback Machine URL Format

To construct a link to view a snapshot:

```
https://web.archive.org/web/{timestamp}/{original_url}
```

**Example:**
```
https://web.archive.org/web/20240115120000/https://example.com/
```

## Examples

### Basic Search

**Request:**
```bash
curl "https://your-app.vercel.app/api/wayback?url=example.com"
```

**Response:**
```json
[
  ["timestamp", "original", "statuscode", "mimetype", "length"],
  ["20240115120000", "https://example.com/", "200", "text/html", "12345"],
  ["20240116083000", "https://example.com/", "200", "text/html", "12456"]
]
```

### Search with Year Filter

**Request:**
```bash
curl "https://your-app.vercel.app/api/wayback?url=example.com&from=2023&to=2023"
```

**Response:**
```json
[
  ["timestamp", "original", "statuscode", "mimetype", "length"],
  ["20230101000000", "https://example.com/", "200", "text/html", "11234"],
  ["20230615120000", "https://example.com/", "200", "text/html", "11567"]
]
```

### No Results

**Request:**
```bash
curl "https://your-app.vercel.app/api/wayback?url=never-existed-site-12345.com"
```

**Response:**
```json
[
  ["timestamp", "original", "statuscode", "mimetype", "length"]
]
```

### JavaScript Usage

**Using fetch:**
```javascript
async function searchWayback(url, from, to) {
  const params = new URLSearchParams({ url })
  if (from) params.set('from', from)
  if (to) params.set('to', to)

  const response = await fetch(`/api/wayback?${params}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()

  // Skip header row
  const snapshots = data.slice(1).map(row => ({
    timestamp: row[0],
    url: row[1],
    status: row[2],
    mimetype: row[3],
    length: row[4]
  }))

  return snapshots
}

// Usage
const results = await searchWayback('example.com', '2023', '2024')
console.log(`Found ${results.length} snapshots`)
```

**Using SWR (as in TimeVault):**
```javascript
import useSWR from 'swr'

const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('API error')
  const data = await response.json()
  return data.slice(1).map(row => ({
    timestamp: row[0],
    url: row[1],
    status: row[2],
    mimetype: row[3],
    length: row[4]
  }))
}

function useWaybackSearch(url, from, to) {
  const params = new URLSearchParams({ url })
  if (from) params.set('from', from)
  if (to) params.set('to', to)

  const { data, error, isLoading } = useSWR(
    `/api/wayback?${params}`,
    fetcher,
    { dedupingInterval: 60000 }
  )

  return { snapshots: data || [], error, isLoading }
}
```

## Rate Limiting

**Current Implementation:** None

**CDX API Limits:**
- No official rate limit documented
- Recommended: Use caching to minimize requests
- Good practice: Implement client-side request throttling

**Planned Improvements:**
- Server-side rate limiting (see [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md))
- IP-based throttling with Upstash Redis
- Per-user limits (when authentication is added)

## Security Considerations

### SSRF Protection

The API route validates and normalizes URLs but does not implement strict SSRF protection.

**Risk:** Users could potentially query internal URLs via the Wayback Machine.

**Mitigation:**
- Wayback Machine itself acts as a filter (only archived public URLs return results)
- No sensitive data exposed through this vector
- Future: Implement URL allowlist/blocklist

### Input Validation

**Current:** Minimal validation (only checks for URL presence)

**Future Improvements:**
- URL format validation
- Parameter sanitization
- Maximum URL length limits

## Performance Considerations

### Response Times

**Typical response times:**
- **Cache hit:** < 50ms
- **Cache miss (small dataset):** 500-2000ms
- **Cache miss (large dataset):** 2000-5000ms

**Factors affecting performance:**
- CDX API response time (varies by load)
- Number of snapshots (1000 limit helps)
- Network latency to Internet Archive servers

### Optimization Tips

1. **Use year filters** - Reduces CDX API processing time
2. **Cache aggressively** - 24-hour TTL is reasonable for historical data
3. **Implement pagination** - For datasets exceeding 1000 snapshots
4. **Monitor cache hit rate** - Use `X-Cache` header for analytics

## Troubleshooting

### Common Issues

**Issue:** "URL parameter is required"
- **Cause:** Missing `url` query parameter
- **Solution:** Ensure URL parameter is included in request

**Issue:** Empty results `[header only]`
- **Cause:** URL never archived or no matches for filters
- **Solution:** Try different URL variations, remove filters

**Issue:** 503 errors from CDX API
- **Cause:** Wayback Machine API overloaded
- **Solution:** Retry with exponential backoff, check [status](https://archive.org/about/)

**Issue:** Slow responses
- **Cause:** Large dataset, CDX API latency
- **Solution:** Use year filters, check cache status

## Future Enhancements

See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md) for planned API improvements:

- Rate limiting with Upstash Redis
- Enhanced error handling with retry logic
- Response pagination for large datasets
- Streaming responses for better perceived performance
- GraphQL endpoint (potential alternative interface)
- WebSocket support for real-time updates

---

**Questions?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or open an issue on GitHub.
