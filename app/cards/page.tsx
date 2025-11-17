"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Home, Calendar, ExternalLink, Clock } from 'lucide-react'
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArchiveResult {
  url: string
  timestamp: string
  title: string
  status: string
  mimetype: string
  length?: string
}

interface GroupedSnapshot {
  date: string
  snapshots: ArchiveResult[]
}

export default function CardsSearch() {
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

  const handleSearch = () => {
    if (!searchUrl.trim()) return
    setActiveSearchUrl(searchUrl)
  }

  const groupedByDate = useMemo(() => {
    let filtered = results

    if (filter) {
      filtered = results.filter(r =>
        r.url.toLowerCase().includes(filter.toLowerCase()) ||
        r.timestamp.includes(filter) ||
        r.status.includes(filter) ||
        r.mimetype.toLowerCase().includes(filter.toLowerCase())
      )
    }

    const groups = new Map<string, ArchiveResult[]>()

    filtered.forEach(snapshot => {
      const dateKey = snapshot.timestamp.slice(0, 8) // YYYYMMDD
      if (!groups.has(dateKey)) {
        groups.set(dateKey, [])
      }
      groups.get(dateKey)!.push(snapshot)
    })

    return Array.from(groups.entries())
      .map(([date, snapshots]) => ({
        date,
        snapshots: snapshots.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [results, filter])

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    const date = new Date(`${year}-${month}-${day}`)

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp: string) => {
    const hour = timestamp.slice(8, 10)
    const minute = timestamp.slice(10, 12)
    const second = timestamp.slice(12, 14)
    return `${hour}:${minute}:${second}`
  }

  const formatBytes = (bytes: string | undefined) => {
    if (!bytes) return 'Unknown'
    const num = parseInt(bytes)
    if (num < 1024) return `${num}B`
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`
    return `${(num / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">TimeVault - Card View</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Snapshots grouped by date</p>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {results.length > 0 && (
              <Input
                placeholder="Filter snapshots..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Loading snapshots...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card className="p-12 text-center border-red-300 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">Failed to load snapshots</p>
          </Card>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Search the Archive</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a URL to see snapshots grouped by date
            </p>
          </Card>
        )}

        {!isLoading && results.length === 0 && activeSearchUrl && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No snapshots found</p>
          </Card>
        )}

        {/* Results Summary */}
        {groupedByDate.length > 0 && !isLoading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {groupedByDate.reduce((acc, g) => acc + g.snapshots.length, 0)} snapshots across {groupedByDate.length} days
              {filter && ' (filtered)'}
            </p>
          </div>
        )}

        {/* Date Cards */}
        <div className="space-y-4">
          {groupedByDate.map((group) => (
            <Card key={group.date} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {formatDate(group.date)}
                  </CardTitle>
                  <Badge variant="secondary">
                    {group.snapshots.length} snapshot{group.snapshots.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {group.snapshots.map((snapshot, idx) => (
                    <a
                      key={idx}
                      href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                              {formatTime(snapshot.timestamp)}
                            </span>
                            <Badge
                              variant={snapshot.status === '200' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {snapshot.status}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {snapshot.mimetype}
                            </span>
                            {snapshot.length && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatBytes(snapshot.length)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {snapshot.url}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
