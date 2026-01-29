import { type NextRequest, NextResponse } from "next/server";

// Mark this route as dynamic to prevent static optimization
export const dynamic = "force-dynamic";

/**
 * Cache entry structure for storing CDX API responses
 */
interface CacheEntry {
  /** The raw CDX API response data (array of arrays) */
  data: string[][];
  /** Unix timestamp (ms) when this entry was cached */
  timestamp: number;
}

/**
 * In-memory cache for API responses
 * Key: Full CDX API URL (including all query parameters)
 * Value: CacheEntry with data and timestamp
 */
const cache = new Map<string, CacheEntry>();

/**
 * Cache time-to-live: 24 hours in milliseconds
 * Historical data rarely changes, so a long TTL is appropriate
 */
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Maximum number of entries in the cache to prevent memory exhaustion
 */
const MAX_CACHE_ENTRIES = 500;
const YEAR_REGEX = /^\d{4}$/;

/**
 * Performs lazy cleanup of expired cache entries
 *
 * This function is called on each request to remove expired entries from the cache.
 * It uses a lazy cleanup strategy rather than active expiration to minimize overhead.
 *
 * @remarks
 * - Only removes entries that have exceeded the TTL
 * - Runs synchronously on the main thread
 * - O(n) complexity where n is the number of cache entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

/**
 * Evicts the oldest cache entry if the cache has exceeded MAX_CACHE_ENTRIES
 * Implements a simple LRU-like eviction strategy based on timestamp
 */
function evictIfNeeded() {
  if (cache.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  let oldestKey: string | null = null;
  let oldestTimestamp = Number.POSITIVE_INFINITY;

  for (const [key, entry] of cache.entries()) {
    if (entry.timestamp < oldestTimestamp) {
      oldestTimestamp = entry.timestamp;
      oldestKey = key;
    }
  }

  if (oldestKey) {
    cache.delete(oldestKey);
  }
}

/**
 * GET handler for the Wayback Machine proxy API endpoint
 *
 * This endpoint proxies requests to the Internet Archive's CDX Server API
 * and provides server-side caching to improve performance and reduce load
 * on the Wayback Machine infrastructure.
 *
 * @param request - The incoming Next.js request object
 * @returns JSON response containing snapshot data or error message
 *
 * @example
 * ```
 * GET /api/wayback?url=example.com
 * GET /api/wayback?url=example.com&from=2020&to=2024
 * ```
 *
 * @remarks
 * **Query Parameters:**
 * - `url` (required): The URL to search for in the archive
 * - `from` (optional): Start year in YYYY format
 * - `to` (optional): End year in YYYY format
 *
 * **Response Format:**
 * ```json
 * [
 *   ["timestamp", "original", "statuscode", "mimetype", "length"],
 *   ["20240115120000", "https://example.com/", "200", "text/html", "12345"]
 * ]
 * ```
 *
 * **Response Headers:**
 * - `X-Cache`: "HIT" or "MISS" indicating cache status
 *
 * **Error Responses:**
 * - 400: Missing required URL parameter
 * - 500: Internal server error or CDX API failure
 * - Other: Proxied status code from CDX API
 *
 * **Caching:**
 * - Cache key: Full CDX API URL (including all parameters)
 * - TTL: 24 hours
 * - Storage: In-memory Map (lost on server restart)
 */
export async function GET(request: NextRequest) {
  try {
    // Perform lazy cleanup of expired cache entries
    cleanupExpiredEntries();

    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    // Input validation
    if (!url?.trim()) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    if (url.length > 2000) {
      return NextResponse.json(
        { error: "URL parameter is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Validate year parameters if provided
    if (from && !YEAR_REGEX.test(from)) {
      return NextResponse.json(
        { error: "from parameter must be a 4-digit year (YYYY)" },
        { status: 400 }
      );
    }

    if (to && !YEAR_REGEX.test(to)) {
      return NextResponse.json(
        { error: "to parameter must be a 4-digit year (YYYY)" },
        { status: 400 }
      );
    }

    const urlParam = url.trim();

    // Build CDX API query
    const cdxUrl = new URL("https://web.archive.org/cdx/search/cdx");
    cdxUrl.searchParams.set("url", urlParam);
    cdxUrl.searchParams.set("output", "json");
    cdxUrl.searchParams.set(
      "fl",
      "timestamp,original,statuscode,mimetype,length"
    );

    // Pass through year filters if provided
    if (from) {
      cdxUrl.searchParams.set("from", from);
    }
    if (to) {
      cdxUrl.searchParams.set("to", to);
    }

    cdxUrl.searchParams.set("limit", "1000");

    // Create cache key from the full CDX URL
    const cacheKey = cdxUrl.toString();

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[v0] Cache hit for:", cacheKey);
      return NextResponse.json(cached.data, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control":
            "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
          "X-Robots-Tag": "noindex",
        },
      });
    }

    console.log("[v0] Cache miss, fetching from CDX API:", cdxUrl.toString());

    // Fetch from CDX API with Next.js caching and User-Agent
    const response = await fetch(cdxUrl.toString(), {
      next: { revalidate: 86_400 }, // Cache for 24 hours
      headers: {
        "User-Agent": "TimeVault/1.0 (Wayback Machine Search Interface)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Wayback Machine API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[v0] Total snapshots returned:", data.length - 1); // -1 for header row

    // Store in cache (evict oldest if needed)
    evictIfNeeded();
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("Wayback API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Wayback Machine" },
      { status: 500 }
    );
  }
}
