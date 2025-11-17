"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, Calendar, Clock, ExternalLink, Archive, Moon, Sun, Monitor, ArrowUpDown, Filter, History, X, Eye, BarChart3, TrendingUp, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch"
import { VirtualizedSnapshotList } from "@/components/virtualized-snapshot-list"
import { formatDate } from "@/lib/utils/formatters"

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
        <div className="container mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Archive className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-balance">TimeVault</h1>
                <p className="text-xs text-muted-foreground hidden xs:block">Modern Wayback Machine Search</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground mr-2">
                <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">/ </kbd>
                <span className="text-[11px]">search</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded border ml-2 text-[10px]">⌘K</kbd>
                <span className="text-[11px]">history</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {currentTheme === "light" && <Sun className="h-4 w-4" />}
                    {currentTheme === "dark" && <Moon className="h-4 w-4" />}
                    {currentTheme === "system" && <Monitor className="h-4 w-4" />}
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

      <main className="container mx-auto px-4 py-4 sm:py-6">
        {/* Hero Section */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-balance px-4">
            Explore the web's
            <span className="block text-primary">archived history</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto text-pretty px-4">
            Search through billions of web pages archived over time. Discover how websites looked and what they
            contained in the past.
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-4xl mx-auto mb-3 sm:mb-4">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              Search Archive
            </CardTitle>
            <CardDescription className="text-xs">Enter a website URL to explore its archived versions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-3">
            <div className="flex gap-2 relative">
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  placeholder="https://example.com"
                  value={searchUrl}
                  onChange={(e) => setSearchUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                  className="flex-1 h-9 text-sm"
                />
                {showHistory && searchHistory.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-1 z-10 shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Recent searches</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="text-xs h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="py-1">
                      {searchHistory.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-accent cursor-pointer group"
                          onClick={() => {
                            setSearchUrl(url)
                            setShowHistory(false)
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">{url}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-auto w-auto p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFromHistory(url)
                            }}
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="shrink-0">
                {isLoading ? (
                  <>
                    <span className="hidden sm:inline">Searching...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground">Quick filters:</span>
              {["2020", "2021", "2022", "2023", "2024", "2025"].map((year) => (
                <Badge
                  key={year}
                  variant={selectedYear === year ? "default" : "secondary"}
                  className="cursor-pointer text-xs h-5"
                  onClick={() => setSelectedYear(selectedYear === year ? "" : year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="max-w-4xl mx-auto py-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                <h3 className="text-lg font-semibold mb-1">Searching archives...</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Querying the Wayback Machine for snapshots
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Archived Versions ({groupedResults.reduce((acc, g) => acc + g.snapshots.length, 0)} snapshots)
              </h3>
            </div>

            {stats && (
              <Card className="mb-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-1.5 pt-2 px-3">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                        <Archive className="h-3 w-3" />
                        <span className="hidden sm:inline">Total Snapshots</span>
                        <span className="sm:hidden">Total</span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold">{stats.total}</div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="hidden sm:inline">Success Rate</span>
                        <span className="sm:hidden">Success</span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold">
                        {Math.round(((stats.statusCounts["200"] || 0) / stats.total) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                        <FileText className="h-3 w-3" />
                        <span className="hidden sm:inline">Avg Size</span>
                        <span className="sm:hidden">Size</span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold">{formatBytes(stats.avgSize)}</div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                        <TrendingUp className="h-3 w-3" />
                        <span className="hidden sm:inline">Date Range</span>
                        <span className="sm:hidden">Range</span>
                      </div>
                      <div className="text-[11px] font-medium break-words">
                        <span className="hidden lg:inline">
                          {formatDateOnly(stats.firstSnapshot)} - {formatDateOnly(stats.lastSnapshot)}
                        </span>
                        <span className="lg:hidden">
                          {formatDateOnly(stats.firstSnapshot).split(',')[0]} - {formatDateOnly(stats.lastSnapshot).split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <div className="text-[11px] font-medium mb-1">Status Codes</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(stats.statusCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([status, count]) => (
                              <Badge key={status} variant="outline" className="text-[10px] h-4 px-1.5">
                                {status}: {count}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-medium mb-1">Content Types</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(stats.mimeTypeCounts)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([mime, count]) => (
                              <Badge key={mime} variant="secondary" className="text-[10px] h-4 px-1.5">
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
            <Card className="mb-3">
              <CardHeader className="pb-1.5 pt-2 px-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Filter & Sort
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-2">
                {/* Search filter */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Filter by URL or timestamp..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                  {filterText && (
                    <Button variant="ghost" size="sm" onClick={() => setFilterText("")} className="h-8 text-xs">
                      Clear
                    </Button>
                  )}
                </div>

                {/* Status and MIME type filters */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <Badge
                      variant={filterStatus === "" ? "default" : "secondary"}
                      className="cursor-pointer text-xs h-5"
                      onClick={() => setFilterStatus("")}
                    >
                      All
                    </Badge>
                    {uniqueStatuses.map((status) => (
                      <Badge
                        key={status}
                        variant={filterStatus === status ? "default" : "secondary"}
                        className="cursor-pointer text-xs h-5"
                        onClick={() => setFilterStatus(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-muted-foreground">Type:</span>
                    <Badge
                      variant={filterMimeType === "" ? "default" : "secondary"}
                      className="cursor-pointer text-xs h-5"
                      onClick={() => setFilterMimeType("")}
                    >
                      All
                    </Badge>
                    {uniqueMimeTypes.slice(0, 5).map((mime) => (
                      <Badge
                        key={mime}
                        variant={filterMimeType === mime ? "default" : "secondary"}
                        className="cursor-pointer text-xs h-5"
                        onClick={() => setFilterMimeType(mime)}
                      >
                        {mime}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sort order */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Sort:</span>
                  <div className="flex gap-1.5">
                    <Button
                      variant={sortOrder === "newest" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSortOrder("newest")}
                      className="flex-1 sm:flex-none h-7 text-xs"
                    >
                      <ArrowUpDown className="h-3 w-3 mr-1.5" />
                      <span className="hidden sm:inline">Newest First</span>
                      <span className="sm:hidden">Newest</span>
                    </Button>
                    <Button
                      variant={sortOrder === "oldest" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSortOrder("oldest")}
                      className="flex-1 sm:flex-none h-7 text-xs"
                    >
                      <ArrowUpDown className="h-3 w-3 mr-1.5" />
                      <span className="hidden sm:inline">Oldest First</span>
                      <span className="sm:hidden">Oldest</span>
                    </Button>
                  </div>
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
          <div className="text-center py-8">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No archives found</h3>
            <p className="text-muted-foreground text-sm">Try searching for a different URL or check your spelling</p>
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
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <Search className="h-6 w-6 text-primary mb-1.5" />
                <CardTitle className="text-base">Smart Search</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-muted-foreground text-sm">
                  Intelligent search through billions of archived web pages with advanced filtering options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <Clock className="h-6 w-6 text-primary mb-1.5" />
                <CardTitle className="text-base">Time Travel</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-muted-foreground text-sm">
                  Navigate through different time periods to see how websites evolved over the years.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <Archive className="h-6 w-6 text-primary mb-1.5" />
                <CardTitle className="text-base">Preserved History</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <p className="text-muted-foreground text-sm">
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
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Powered by Internet Archive's Wayback Machine</p>
            <p className="text-xs mt-1">Preserving digital history for future generations</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
