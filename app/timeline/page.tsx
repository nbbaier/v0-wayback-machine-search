"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Home, Calendar, ExternalLink, Image, FileText, Clock } from 'lucide-react'
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  year: string
  month: string
  snapshots: ArchiveResult[]
}

export default function TimelineSearch() {
  const [searchUrl, setSearchUrl] = useState("")
  const [activeSearchUrl, setActiveSearchUrl] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

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

  const groupedByYearMonth = useMemo(() => {
    const groups = new Map<string, GroupedSnapshot>()

    let filtered = results
    if (selectedYear) {
      filtered = results.filter(r => r.timestamp.startsWith(selectedYear))
    }

    filtered.forEach(snapshot => {
      const year = snapshot.timestamp.slice(0, 4)
      const month = snapshot.timestamp.slice(4, 6)
      const key = `${year}-${month}`

      if (!groups.has(key)) {
        groups.set(key, { year, month, snapshots: [] })
      }
      groups.get(key)!.snapshots.push(snapshot)
    })

    return Array.from(groups.values()).sort((a, b) =>
      `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`)
    )
  }, [results, selectedYear])

  const availableYears = useMemo(() => {
    const years = new Set(results.map(r => r.timestamp.slice(0, 4)))
    return Array.from(years).sort().reverse()
  }, [results])

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const formatTimestamp = (ts: string) => {
    const year = ts.slice(0, 4)
    const month = ts.slice(4, 6)
    const day = ts.slice(6, 8)
    const hour = ts.slice(8, 10)
    const minute = ts.slice(10, 12)
    return `${monthNames[parseInt(month) - 1]} ${day}, ${year} at ${hour}:${minute}`
  }

  const formatBytes = (bytes: string | undefined) => {
    if (!bytes) return 'Unknown'
    const num = parseInt(bytes)
    if (num < 1024) return `${num}B`
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`
    return `${(num / (1024 * 1024)).toFixed(1)}MB`
  }

  const getScreenshotUrl = (timestamp: string, url: string) => {
    return `https://web.archive.org/web/${timestamp}im_/${url}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TimeVault Timeline
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visual journey through time</p>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Explore'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Year Filter */}
        {availableYears.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by year:</span>
            <Badge
              variant={selectedYear === "" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedYear("")}
            >
              All ({results.length})
            </Badge>
            {availableYears.map(year => (
              <Badge
                key={year}
                variant={selectedYear === year ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedYear(year)}
              >
                {year} ({results.filter(r => r.timestamp.startsWith(year)).length})
              </Badge>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-12 w-12 text-purple-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Traveling through time...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card className="p-12 text-center border-red-300 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">Failed to load timeline</p>
          </Card>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a URL to visualize its history on the timeline
            </p>
          </Card>
        )}

        {!isLoading && results.length === 0 && activeSearchUrl && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No snapshots found in the archive</p>
          </Card>
        )}

        {/* Timeline */}
        {groupedByYearMonth.length > 0 && !isLoading && (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-pink-400" />

            <div className="space-y-8">
              {groupedByYearMonth.map((group, groupIdx) => (
                <div key={`${group.year}-${group.month}`} className="relative">
                  {/* Timeline Marker */}
                  <div className="absolute left-4 md:left-1/2 -ml-3 md:-ml-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-4 border-white dark:border-gray-900 shadow-lg z-10 flex items-center justify-center">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 ${groupIdx % 2 === 0 ? 'md:mr-[52%]' : 'md:ml-[52%]'}`}>
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {monthNames[parseInt(group.month) - 1]} {group.year}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {group.snapshots.length} snapshot{group.snapshots.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {group.snapshots.map((snapshot, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                              {/* Preview */}
                              <div className="w-full sm:w-32 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded flex items-center justify-center shrink-0">
                                {snapshot.mimetype.includes('image') ? (
                                  <Image className="h-8 w-8 text-purple-600" />
                                ) : snapshot.mimetype.includes('html') ? (
                                  <FileText className="h-8 w-8 text-blue-600" />
                                ) : (
                                  <FileText className="h-8 w-8 text-gray-600" />
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge
                                    variant={snapshot.status === '200' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {snapshot.status}
                                  </Badge>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {snapshot.mimetype}
                                  </span>
                                  {snapshot.length && (
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {formatBytes(snapshot.length)}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  {formatTimestamp(snapshot.timestamp)}
                                </p>

                                <a
                                  href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View Snapshot
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
