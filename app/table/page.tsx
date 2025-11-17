"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Home, ArrowUpDown, ExternalLink, Search } from 'lucide-react'
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

type SortColumn = 'timestamp' | 'status' | 'mimetype' | 'length'
type SortDirection = 'asc' | 'desc'

export default function TableSearch() {
  const [searchUrl, setSearchUrl] = useState("")
  const [activeSearchUrl, setActiveSearchUrl] = useState<string>("")
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedAndFilteredResults = useMemo(() => {
    let filtered = results

    if (filter) {
      filtered = results.filter(r =>
        r.url.toLowerCase().includes(filter.toLowerCase()) ||
        r.timestamp.includes(filter) ||
        r.status.includes(filter) ||
        r.mimetype.toLowerCase().includes(filter.toLowerCase())
      )
    }

    return [...filtered].sort((a, b) => {
      let aVal = a[sortColumn] || ''
      let bVal = b[sortColumn] || ''

      if (sortColumn === 'length') {
        aVal = parseInt(a.length || '0')
        bVal = parseInt(b.length || '0')
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [results, filter, sortColumn, sortDirection])

  const formatTimestamp = (ts: string) => {
    return `${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)} ${ts.slice(8,10)}:${ts.slice(10,12)}`
  }

  const formatBytes = (bytes: string | undefined) => {
    if (!bytes) return '-'
    const num = parseInt(bytes)
    if (num < 1024) return `${num}B`
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`
    return `${(num / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">TimeVault - Table View</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Spreadsheet-style archive browser</p>
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
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filter and Stats */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {sortedAndFilteredResults.length} of {results.length} snapshots
                </span>
                {filter && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Filtered
                  </span>
                )}
              </div>
              <Input
                placeholder="Filter table..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading snapshots...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">Error loading data</p>
            <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Please try again</p>
          </div>
        )}

        {!isLoading && results.length === 0 && activeSearchUrl && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No archives found</p>
          </div>
        )}

        {sortedAndFilteredResults.length > 0 && !isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center gap-2">
                        Timestamp
                        {sortColumn === 'timestamp' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === 'status' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleSort('mimetype')}
                    >
                      <div className="flex items-center gap-2">
                        MIME Type
                        {sortColumn === 'mimetype' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleSort('length')}
                    >
                      <div className="flex items-center gap-2">
                        Size
                        {sortColumn === 'length' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {sortedAndFilteredResults.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2 text-gray-500 dark:text-gray-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {formatTimestamp(result.timestamp)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            result.status === '200'
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                              : result.status.startsWith('3')
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
                        {result.mimetype}
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                        {formatBytes(result.length)}
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={`https://web.archive.org/web/${result.timestamp}/${result.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!activeSearchUrl && !isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Enter a URL to start searching</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Results will appear in a sortable table format
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
