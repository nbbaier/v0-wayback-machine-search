"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Home, Search, ExternalLink } from 'lucide-react'
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    return `${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)} ${ts.slice(8,10)}:${ts.slice(10,12)}`
  }

  const formatBytes = (bytes: string | undefined) => {
    if (!bytes) return '—'
    const num = parseInt(bytes)
    if (num < 1024) return `${num}B`
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(0)}KB`
    return `${(num / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-1">TimeVault</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Minimal Interface</p>
            </div>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-2 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="text"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="Enter URL to search..."
                className="flex-1 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 px-6"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {results.length > 0 && (
              <Input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter results..."
                className="h-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-zinc-500">
              <Search className="h-5 w-5 animate-pulse" />
              <span>Searching archives...</span>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-red-600 dark:text-red-400">Error loading data</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Please try again</p>
          </div>
        )}

        {!isLoading && results.length === 0 && activeSearchUrl && (
          <div className="text-center py-16">
            <p className="text-zinc-500">No archives found</p>
          </div>
        )}

        {filteredResults.length > 0 && !isLoading && (
          <>
            <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500">
                {filteredResults.length} snapshot{filteredResults.length !== 1 ? 's' : ''}
                {filter && ` (filtered from ${results.length})`}
              </p>
            </div>

            <div className="space-y-px">
              {filteredResults.map((result, idx) => (
                <a
                  key={idx}
                  href={`https://web.archive.org/web/${result.timestamp}/${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-l-2 border-transparent hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all py-3 px-4 -mx-4 group"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <span className="text-sm font-medium font-mono text-zinc-600 dark:text-zinc-400">
                      {formatTimestamp(result.timestamp)}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-mono ${result.status === '200' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {result.status}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {result.mimetype}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {formatBytes(result.length)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
                      {result.url}
                    </span>
                    <ExternalLink className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <div className="text-center py-16">
            <p className="text-zinc-500 mb-2">Enter a URL to begin</p>
            <p className="text-sm text-zinc-400">Clean, distraction-free archive browsing</p>
          </div>
        )}
      </div>
    </div>
  )
}
