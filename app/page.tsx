"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Archive,
  Moon,
  Sun,
  Monitor,
  ArrowUpDown,
  Filter,
  History,
  X,
  Eye,
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle2,
  ScaleIcon as Skeleton,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"
import { VirtualizedSnapshotList } from "@/components/virtualized-snapshot-list"

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

export default function WaybackSearch() {
  const [searchUrl, setSearchUrl] = useState("")
  const [activeSearchUrl, setActiveSearchUrl] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("system")

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [filterText, setFilterText] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterMimeType, setFilterMimeType] = useState<string>("")

  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const [previewSnapshot, setPreviewSnapshot] = useState<ArchiveResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use SWR for data fetching with caching
  const searchParams = useMemo(() => {
    if (!activeSearchUrl) return null

    let cleanUrl = activeSearchUrl.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl
    }

    return {
      url: cleanUrl,
      from: selectedYear || undefined,
      to: selectedYear || undefined,
    }
  }, [activeSearchUrl, selectedYear])

  const { data: results, isLoading, isError } = useWaybackSearch(searchParams)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    const initialTheme = savedTheme || "system"
    setCurrentTheme(initialTheme)
    applyTheme(initialTheme)

    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (currentTheme === "system") {
        applyTheme("system")
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (currentTheme === "system") {
        applyTheme("system")
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [currentTheme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" to focus search
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Escape to clear search or close modals
      if (e.key === "Escape") {
        if (showPreview) {
          setShowPreview(false)
        } else if (showHistory) {
          setShowHistory(false)
        } else if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur()
        }
      }

      // Ctrl/Cmd + K to toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setShowHistory(!showHistory)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showPreview, showHistory])

  const applyTheme = (themeValue: "light" | "dark" | "system") => {
    if (themeValue === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    } else {
      document.documentElement.classList.toggle("dark", themeValue === "dark")
    }
  }

  const setTheme = (themeValue: "light" | "dark" | "system") => {
    setCurrentTheme(themeValue)
    localStorage.setItem("theme", themeValue)
    applyTheme(themeValue)
  }

  const saveToHistory = (url: string) => {
    const newHistory = [url, ...searchHistory.filter((h) => h !== url)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const removeFromHistory = (url: string) => {
    const newHistory = searchHistory.filter((h) => h !== url)
    setSearchHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
    setShowHistory(false)
  }

  const handleSearch = () => {
    if (!searchUrl.trim()) return

    let cleanUrl = searchUrl.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl
    }

    saveToHistory(cleanUrl)
    setActiveSearchUrl(cleanUrl)
  }

  const formatDate = (timestamp: string) => {
    const year = timestamp.slice(0, 4)
    const month = timestamp.slice(4, 6)
    const day = timestamp.slice(6, 8)
    const hour = timestamp.slice(8, 10)
    const minute = timestamp.slice(10, 12)

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateOnly = (timestamp: string) => {
    const year = timestamp.slice(0, 4)
    const month = timestamp.slice(4, 6)
    const day = timestamp.slice(6, 8)

    return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeOnly = (timestamp: string) => {
    const hour = timestamp.slice(8, 10)
    const minute = timestamp.slice(10, 12)
    const second = timestamp.slice(12, 14)

    return `${hour}:${minute}:${second}`
  }

  const groupSnapshotsByDate = (snapshots: ArchiveResult[]): GroupedSnapshot[] => {
    let filtered = snapshots

    if (filterText) {
      filtered = filtered.filter(
        (s) => s.url.toLowerCase().includes(filterText.toLowerCase()) || s.timestamp.includes(filterText),
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((s) => s.status === filterStatus)
    }

    if (filterMimeType) {
      filtered = filtered.filter((s) => s.mimetype === filterMimeType)
    }

    const grouped = new Map<string, ArchiveResult[]>()

    filtered.forEach((snapshot) => {
      const dateKey = snapshot.timestamp.slice(0, 8)
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(snapshot)
    })

    return Array.from(grouped.entries())
      .map(([date, snapshots]) => ({
        date,
        snapshots: snapshots.sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
      }))
      .sort((a, b) => (sortOrder === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
  }

  const getWaybackUrl = (timestamp: string, url: string) => {
    return `https://web.archive.org/web/${timestamp}/${url}`
  }

  const openPreview = (snapshot: ArchiveResult) => {
    setPreviewSnapshot(snapshot)
    setShowPreview(true)
  }

  const uniqueStatuses = Array.from(new Set(results.map((r) => r.status))).sort()
  const uniqueMimeTypes = Array.from(new Set(results.map((r) => r.mimetype))).sort()

  const groupedResults = groupSnapshotsByDate(results)

  const calculateStats = () => {
    if (results.length === 0) return null

    const statusCounts = results.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mimeTypeCounts = results.reduce(
      (acc, r) => {
        acc[r.mimetype] = (acc[r.mimetype] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const timestamps = results.map((r) => r.timestamp).sort()
    const firstSnapshot = timestamps[0]
    const lastSnapshot = timestamps[timestamps.length - 1]

    const totalSize = results.reduce((acc, r) => {
      const size = Number.parseInt(r.length || "0")
      return acc + (isNaN(size) ? 0 : size)
    }, 0)

    const avgSize = totalSize / results.length

    return {
      total: results.length,
      statusCounts,
      mimeTypeCounts,
      firstSnapshot,
      lastSnapshot,
      totalSize,
      avgSize,
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-balance">TimeVault</h1>
                <p className="text-sm text-muted-foreground">Modern Wayback Machine Search</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground mr-4">
                <kbd className="px-2 py-1 bg-muted rounded border">/ </kbd>
                <span>to search</span>
                <kbd className="px-2 py-1 bg-muted rounded border ml-2">⌘K</kbd>
                <span>for history</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {currentTheme === "light" && <Sun className="h-5 w-5" />}
                    {currentTheme === "dark" && <Moon className="h-5 w-5" />}
                    {currentTheme === "system" && <Monitor className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Explore the web's
            <span className="block text-primary">archived history</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Search through billions of web pages archived over time. Discover how websites looked and what they
            contained in the past.
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Archive
            </CardTitle>
            <CardDescription>Enter a website URL to explore its archived versions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  placeholder="https://example.com"
                  value={searchUrl}
                  onChange={(e) => setSearchUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                  className="flex-1"
                />
                {showHistory && searchHistory.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-2 z-10 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Recent Searches
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={clearHistory}>
                            Clear All
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {searchHistory.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 p-2 rounded hover:bg-accent cursor-pointer group"
                          onClick={() => {
                            setSearchUrl(url)
                            setShowHistory(false)
                          }}
                        >
                          <span className="text-sm truncate flex-1">{url}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromHistory(url)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Quick filters:</span>
              {["2020", "2021", "2022", "2023", "2024", "2025"].map((year) => (
                <Badge
                  key={year}
                  variant={selectedYear === year ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedYear(selectedYear === year ? "" : year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-20 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Archived Versions ({groupedResults.reduce((acc, g) => acc + g.snapshots.length, 0)} snapshots)
              </h3>
            </div>

            {stats && (
              <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Statistics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Archive className="h-4 w-4" />
                        Total Snapshots
                      </div>
                      <div className="text-2xl font-bold">{stats.total}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Success Rate
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round(((stats.statusCounts["200"] || 0) / stats.total) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <FileText className="h-4 w-4" />
                        Avg Size
                      </div>
                      <div className="text-2xl font-bold">{formatBytes(stats.avgSize)}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Date Range
                      </div>
                      <div className="text-sm font-medium">
                        {formatDateOnly(stats.firstSnapshot)} - {formatDateOnly(stats.lastSnapshot)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Status Codes</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats.statusCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([status, count]) => (
                              <Badge key={status} variant="outline" className="text-xs">
                                {status}: {count}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Content Types</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats.mimeTypeCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([mime, count]) => (
                              <Badge key={mime} variant="secondary" className="text-xs">
                                {mime}: {count}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filter & Sort Results */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter & Sort Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search filter */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Filter by URL or timestamp..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="flex-1"
                  />
                  {filterText && (
                    <Button variant="ghost" onClick={() => setFilterText("")}>
                      Clear
                    </Button>
                  )}
                </div>

                {/* Status and MIME type filters */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge
                      variant={filterStatus === "" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setFilterStatus("")}
                    >
                      All
                    </Badge>
                    {uniqueStatuses.map((status) => (
                      <Badge
                        key={status}
                        variant={filterStatus === status ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setFilterStatus(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge
                      variant={filterMimeType === "" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setFilterMimeType("")}
                    >
                      All
                    </Badge>
                    {uniqueMimeTypes.slice(0, 5).map((mime) => (
                      <Badge
                        key={mime}
                        variant={filterMimeType === mime ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setFilterMimeType(mime)}
                      >
                        {mime}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort order */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort:</span>
                  <Button
                    variant={sortOrder === "newest" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSortOrder("newest")}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Newest First
                  </Button>
                  <Button
                    variant={sortOrder === "oldest" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSortOrder("oldest")}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Oldest First
                  </Button>
                </div>
              </CardContent>
            </Card>

            <VirtualizedSnapshotList
              groupedResults={groupedResults}
              formatDateOnly={formatDateOnly}
              formatTimeOnly={formatTimeOnly}
              formatBytes={formatBytes}
              getWaybackUrl={getWaybackUrl}
              openPreview={openPreview}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && activeSearchUrl && (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No archives found</h3>
            <p className="text-muted-foreground">Try searching for a different URL or check your spelling</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 max-w-4xl mx-auto">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Search Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Failed to fetch archive data. Please try again later.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Grid */}
        {results.length === 0 && !activeSearchUrl && !isLoading && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intelligent search through billions of archived web pages with advanced filtering options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Time Travel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Navigate through different time periods to see how websites evolved over the years.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Archive className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Preserved History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access preserved versions of websites that may no longer exist or have changed significantly.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Snapshot Preview
              {previewSnapshot && (
                <span className="text-sm font-normal text-muted-foreground">
                  {formatDate(previewSnapshot.timestamp)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewSnapshot && (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge variant="outline">{previewSnapshot.status}</Badge>
                <Badge variant="secondary">{previewSnapshot.mimetype}</Badge>
                {previewSnapshot.length && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {formatBytes(Number.parseInt(previewSnapshot.length))}
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs truncate flex-1">{previewSnapshot.url}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getWaybackUrl(previewSnapshot.timestamp, previewSnapshot.url), "_blank")}
                  className="ml-auto"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
              <iframe
                src={getWaybackUrl(previewSnapshot.timestamp, previewSnapshot.url)}
                className="w-full flex-1 border rounded-lg"
                title="Snapshot Preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>Powered by Internet Archive's Wayback Machine</p>
            <p className="text-sm mt-2">Preserving digital history for future generations</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
