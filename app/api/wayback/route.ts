import { type NextRequest, NextResponse } from "next/server"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

// In-memory cache for API responses
interface CacheEntry {
  data: string[][]
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Helper function to clean up expired cache entries (lazy cleanup)
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Perform lazy cleanup of expired cache entries
    cleanupExpiredEntries()
    
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    // Build CDX API query
    const cdxUrl = new URL("https://web.archive.org/cdx/search/cdx")
    cdxUrl.searchParams.set("url", url)
    cdxUrl.searchParams.set("output", "json")
    cdxUrl.searchParams.set("fl", "timestamp,original,statuscode,mimetype,length")

    // Pass through year filters if provided
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from) cdxUrl.searchParams.set("from", from)
    if (to) cdxUrl.searchParams.set("to", to)

    cdxUrl.searchParams.set("limit", "1000")

    // Create cache key from the full CDX URL
    const cacheKey = cdxUrl.toString()

    // Check cache first
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[v0] Cache hit for:", cacheKey)
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    console.log("[v0] Cache miss, fetching from CDX API:", cdxUrl.toString())

    const response = await fetch(cdxUrl.toString())

    if (!response.ok) {
      return NextResponse.json({ error: `Wayback Machine API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Total snapshots returned:", data.length - 1) // -1 for header row

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    console.error("Wayback API error:", error)
    return NextResponse.json({ error: "Failed to fetch from Wayback Machine" }, { status: 500 })
  }
}
