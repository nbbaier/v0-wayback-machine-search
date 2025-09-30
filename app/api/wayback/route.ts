import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    // Build CDX API query
    const cdxUrl = new URL("https://web.archive.org/cdx/search/cdx")
    cdxUrl.searchParams.set("url", url)
    cdxUrl.searchParams.set("output", "json")
    cdxUrl.searchParams.set("fl", "timestamp,original,statuscode,mimetype")

    // Pass through year filters if provided
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from) cdxUrl.searchParams.set("from", from)
    if (to) cdxUrl.searchParams.set("to", to)

    cdxUrl.searchParams.set("limit", "1000")

    console.log("[v0] CDX API URL:", cdxUrl.toString())

    const response = await fetch(cdxUrl.toString())

    if (!response.ok) {
      return NextResponse.json({ error: `Wayback Machine API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Total snapshots returned:", data.length - 1) // -1 for header row
    return NextResponse.json(data)
  } catch (error) {
    console.error("Wayback API error:", error)
    return NextResponse.json({ error: "Failed to fetch from Wayback Machine" }, { status: 500 })
  }
}
