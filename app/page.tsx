"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Clock, ExternalLink, Archive, Moon, Sun, Monitor, ArrowUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ArchiveResult {
  url: string
  timestamp: string
  title: string
  status: string
  mimetype: string
}

interface GroupedSnapshot {
  date: string
  snapshots: ArchiveResult[]
}

export default function WaybackSearch() {
  const [searchUrl, setSearchUrl] = useState("")
  const [results, setResults] = useState<ArchiveResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("system")

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [filterText, setFilterText] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterMimeType, setFilterMimeType] = useState<string>("")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    const initialTheme = savedTheme || "system"
    setCurrentTheme(initialTheme)
    applyTheme(initialTheme)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (currentTheme === "system") {
        applyTheme("system")
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const applyTheme = (theme: "light" | "dark" | "system") => {
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }

  const setTheme = (theme: "light" | "dark" | "system") => {
    setCurrentTheme(theme)
    localStorage.setItem("theme", theme)
    applyTheme(theme)
  }

  const handleSearch = async () => {
    if (!searchUrl.trim()) return

    setLoading(true)
    try {
      let cleanUrl = searchUrl.trim()
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = "https://" + cleanUrl
      }

      const apiUrl = new URL("/api/wayback", window.location.origin)
      apiUrl.searchParams.set("url", cleanUrl)

      if (selectedYear) {
        apiUrl.searchParams.set("from", selectedYear)
        apiUrl.searchParams.set("to", selectedYear)
      }

      console.log("[v0] Fetching from API:", apiUrl.toString())

      const response = await fetch(apiUrl.toString())

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Raw API response rows:", data.length)

      const snapshots = data.slice(1).map((row: string[]) => ({
        timestamp: row[0],
        url: row[1],
        status: row[2],
        mimetype: row[3],
        title: `Snapshot from ${formatDate(row[0])}`,
      }))

      console.log("[v0] Processed snapshots:", snapshots.length)
      console.log("[v0] Sample snapshots:", snapshots.slice(0, 3))

      setResults(snapshots)
    } catch (error) {
      console.error("[v0] Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
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

  const uniqueStatuses = Array.from(new Set(results.map((r) => r.status))).sort()
  const uniqueMimeTypes = Array.from(new Set(results.map((r) => r.mimetype))).sort()

  const groupedResults = groupSnapshotsByDate(results)

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
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
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

        {/* Results Section */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Archived Versions ({groupedResults.reduce((acc, g) => acc + g.snapshots.length, 0)} snapshots)
              </h3>
            </div>

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

            <div className="grid gap-4">
              {groupedResults.map((group, groupIndex) => (
                <Card key={groupIndex} className="hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{formatDateOnly(group.date + "000000")}</CardTitle>
                      <Badge variant="secondary" className="ml-auto">
                        {group.snapshots.length} {group.snapshots.length === 1 ? "snapshot" : "snapshots"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {group.snapshots.map((snapshot, snapshotIndex) => (
                      <div
                        key={snapshotIndex}
                        className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-mono font-medium">{formatTimeOnly(snapshot.timestamp)}</span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {snapshot.status}
                          </Badge>
                          {snapshot.mimetype && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {snapshot.mimetype}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(getWaybackUrl(snapshot.timestamp, snapshot.url), "_blank")}
                          className="shrink-0"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && searchUrl && (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No archives found</h3>
            <p className="text-muted-foreground">Try searching for a different URL or check your spelling</p>
          </div>
        )}

        {/* Features Grid */}
        {results.length === 0 && !searchUrl && (
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
