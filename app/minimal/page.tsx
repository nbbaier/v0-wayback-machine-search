"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Home, ArrowLeft } from 'lucide-react'
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"

interface ArchiveResult {
  url: string
  timestamp: string
  title: string
  status: string
  mimetype: string
  length?: string
}

export default function MinimalSearch() {
  const [searchUrl, setSearchUrl] = useState("")
  const [activeSearchUrl, setActiveSearchUrl] = useState<string>("")
  const [filter, setFilter] = useState("")

  const searchParams = useMemo(() => {
    if (!activeSearchUrl) return null

    let cleanUrl = activeSearchUrl.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl
    }

    return { url: cleanUrl }
  }, [activeSearchUrl])

  const { data: results, isLoading, isError } = useWaybackSearch(searchParams)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchUrl.trim()) return
    setActiveSearchUrl(searchUrl)
  }

  const filteredResults = useMemo(() => {
    if (!filter) return results
    return results.filter(r =>
      r.url.toLowerCase().includes(filter.toLowerCase()) ||
      r.timestamp.includes(filter) ||
      r.status.includes(filter)
    )
  }, [results, filter])

  const formatTimestamp = (ts: string) => {
    // YYYYMMDDHHmmss -> YYYY-MM-DD HH:mm:ss
    return `${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)} ${ts.slice(8,10)}:${ts.slice(10,12)}:${ts.slice(12,14)}`
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4 border-b border-green-400/30 pb-2">
          <div>
            <h1 className="text-2xl mb-1">TIMEVAULT // MINIMAL</h1>
            <p className="text-green-400/60 text-sm">Wayback Machine Terminal Interface</p>
          </div>
          <Link
            href="/"
            className="text-green-400/60 hover:text-green-400 transition-colors flex items-center gap-2 text-sm"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">HOME</span>
          </Link>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label className="text-xs text-green-400/60 block mb-1">$ search --url</label>
              <input
                type="text"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-black border border-green-400/30 text-green-400 px-3 py-2 focus:outline-none focus:border-green-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-400/10 border border-green-400/30 text-green-400 px-6 py-2 hover:bg-green-400/20 disabled:opacity-50 transition-colors sm:mt-auto"
            >
              {isLoading ? 'SEARCHING...' : 'EXECUTE'}
            </button>
          </div>
        </form>

        {/* Filter */}
        {results.length > 0 && (
          <div className="mb-4">
            <label className="text-xs text-green-400/60 block mb-1">$ filter --query</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter results..."
              className="w-full bg-black border border-green-400/30 text-green-400 px-3 py-2 focus:outline-none focus:border-green-400"
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        {isLoading && (
          <div className="border border-green-400/30 p-6 text-center">
            <div className="animate-pulse">
              <p>{'>'} QUERYING WAYBACK MACHINE...</p>
              <p className="text-green-400/60 mt-2">Please wait...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="border border-red-400/50 p-6">
            <p className="text-red-400">ERROR: Failed to fetch archive data</p>
            <p className="text-red-400/60 text-sm mt-2">Please try again later</p>
          </div>
        )}

        {!isLoading && results.length === 0 && activeSearchUrl && (
          <div className="border border-green-400/30 p-6">
            <p>{'>'} NO ARCHIVES FOUND</p>
            <p className="text-green-400/60 text-sm mt-2">Try a different URL</p>
          </div>
        )}

        {filteredResults.length > 0 && !isLoading && (
          <>
            <div className="border border-green-400/30 mb-4 p-4">
              <p className="text-sm">
                {'>'} FOUND {filteredResults.length} SNAPSHOT{filteredResults.length !== 1 ? 'S' : ''}
                {filter && ` (FILTERED FROM ${results.length})`}
              </p>
            </div>

            <div className="space-y-2">
              {filteredResults.map((result, idx) => (
                <div
                  key={idx}
                  className="border border-green-400/20 p-3 hover:border-green-400 hover:bg-green-400/5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="text-green-400/80 text-xs">
                      [{formatTimestamp(result.timestamp)}]
                    </span>
                    <span className="text-xs">
                      STATUS: <span className={result.status === '200' ? 'text-green-400' : 'text-yellow-400'}>{result.status}</span>
                    </span>
                    <span className="text-xs text-green-400/60">
                      TYPE: {result.mimetype}
                    </span>
                    {result.length && (
                      <span className="text-xs text-green-400/60">
                        SIZE: {(parseInt(result.length) / 1024).toFixed(1)}KB
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://web.archive.org/web/${result.timestamp}/${result.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline break-all text-sm block"
                  >
                    {'>'} {result.url}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <div className="border border-green-400/30 p-8 text-center">
            <p className="mb-4">{'>'} TERMINAL READY</p>
            <p className="text-green-400/60 text-sm">Enter a URL to search the Wayback Machine</p>
            <div className="mt-6 text-left max-w-md mx-auto text-xs text-green-400/60">
              <p className="mb-2">COMMANDS:</p>
              <p>- Enter URL and press EXECUTE</p>
              <p>- Use filter to narrow results</p>
              <p>- Click snapshots to view archives</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-green-400/30">
        <p className="text-xs text-green-400/60 text-center">
          POWERED BY INTERNET ARCHIVE // WAYBACK MACHINE
        </p>
      </div>
    </div>
  )
}
