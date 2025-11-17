"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Home, Calendar, ExternalLink, Clock, LayoutGrid } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <LayoutGrid className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    TimeVault Cards
                  </h1>
                  <p className="text-sm text-muted-foreground">Snapshots grouped by date</p>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
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
              <Button onClick={handleSearch} disabled={isLoading} className="bg-primary hover:opacity-90">
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

      <div className="max-w-6xl mx-auto px-4 pt-0 pb-3">
        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-pulse" />
                <Clock className="h-12 w-12 text-primary animate-spin relative" />
              </div>
              <p className="text-muted-foreground font-medium">Loading snapshots...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card className="p-12 text-center border-destructive/50">
            <p className="text-destructive font-medium">Failed to load snapshots</p>
          </Card>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="inline-block p-4 bg-primary rounded-2xl mb-4">
              <Calendar className="h-16 w-16 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Search the Archive</h3>
            <p className="text-muted-foreground">
              Enter a URL to see snapshots grouped by date
            </p>
          </Card>
        )}

        {/* Results Summary */}
        {groupedByDate.length > 0 && !isLoading && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Found {groupedByDate.reduce((acc, g) => acc + g.snapshots.length, 0)} snapshots across {groupedByDate.length} days
              {filter && ' (filtered)'}
            </p>
          </div>
        )}

        {/* Date Cards */}
        <div className="space-y-4">
          {groupedByDate.map((group) => (
            <Card key={group.date} className="overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatDate(group.date)}
                    </span>
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {group.snapshots.length} snapshot{group.snapshots.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {group.snapshots.map((snapshot, idx) => {
                    const statusColor = snapshot.status.startsWith('2') 
                      ? 'bg-chart-2/10 text-chart-2 border-chart-2/30'
                      : snapshot.status.startsWith('3')
                      ? 'bg-chart-3/10 text-chart-3 border-chart-3/30'
                      : 'bg-destructive/10 text-destructive border-destructive/30'

                    return (
                      <div
                        key={idx}
                        className="relative p-3 hover:bg-muted/30 transition-all duration-300 group"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 items-start">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-lg font-mono font-bold text-foreground">
                              {formatTime(snapshot.timestamp)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge className={`text-xs font-medium border ${statusColor}`}>
                                {snapshot.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-muted/50">
                                {snapshot.mimetype}
                              </Badge>
                              {snapshot.length && (
                                <Badge variant="outline" className="text-xs bg-muted/50">
                                  {formatBytes(snapshot.length)}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                              <p className="text-sm text-muted-foreground break-all group-hover:text-primary transition-colors">
                                {snapshot.url}
                              </p>
                            </div>
                          </div>

                          <a
                            href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0"
                          >
                            <Button 
                              size="sm" 
                              className="bg-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Archive
                            </Button>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
