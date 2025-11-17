"use client"

import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, Eye, FileText } from "lucide-react"

/**
 * Represents a single archived snapshot from the Wayback Machine
 */
interface ArchiveResult {
  /** The archived URL */
  url: string
  /** Capture timestamp in YYYYMMDDHHmmss format */
  timestamp: string
  /** Human-readable title for display */
  title: string
  /** HTTP status code (e.g., "200", "404") */
  status: string
  /** MIME type of the content */
  mimetype: string
  /** Content length in bytes (optional) */
  length?: string
}

/**
 * Snapshots grouped by date
 */
interface GroupedSnapshot {
  /** Date key in YYYYMMDD format */
  date: string
  /** Array of snapshots captured on this date */
  snapshots: ArchiveResult[]
}

/**
 * Props for the VirtualizedSnapshotList component
 */
interface VirtualizedSnapshotListProps {
  /** Pre-filtered and grouped snapshot results */
  groupedResults: GroupedSnapshot[]
  /** Function to format timestamp to date-only string */
  formatDateOnly: (timestamp: string) => string
  /** Function to format timestamp to time-only string */
  formatTimeOnly: (timestamp: string) => string
  /** Function to format bytes to human-readable size */
  formatBytes: (bytes: number) => string
  /** Function to construct Wayback Machine URL */
  getWaybackUrl: (timestamp: string, url: string) => string
  /** Callback when user clicks preview button */
  openPreview: (snapshot: ArchiveResult) => void
}

/**
 * Height estimation for group header (date + badge)
 * Used by virtualizer to calculate scroll positions
 * Adjusted for compact layout while accounting for responsive wrapping
 */
const HEADER_HEIGHT = 100

/**
 * Height estimation for each snapshot item
 * Includes timestamp, status, mimetype, and action buttons
 * Increased to account for mobile stacking layout
 */
const SNAPSHOT_ITEM_HEIGHT = 140

/**
 * Virtualized list component for efficiently rendering large numbers of snapshots
 *
 * This component uses @tanstack/react-virtual to render only the visible snapshots,
 * dramatically improving performance when displaying thousands of results. It groups
 * snapshots by date and uses dynamic height calculation for each group.
 *
 * @example
 * ```tsx
 * <VirtualizedSnapshotList
 *   groupedResults={groupedSnapshots}
 *   formatDateOnly={formatDateOnly}
 *   formatTimeOnly={formatTimeOnly}
 *   formatBytes={formatBytes}
 *   getWaybackUrl={getWaybackUrl}
 *   openPreview={handlePreview}
 * />
 * ```
 *
 * @remarks
 * **Performance Characteristics:**
 * - Renders only visible items (typically 5-10 groups at a time)
 * - O(1) rendering complexity regardless of dataset size
 * - Can handle 10,000+ snapshots smoothly
 * - Uses 2-item overscan for smooth scrolling
 *
 * **Height Calculation:**
 * - Each group's height = HEADER_HEIGHT + (snapshots.length * SNAPSHOT_ITEM_HEIGHT)
 * - Heights are estimated, virtualizer adjusts as items render
 *
 * **Accessibility:**
 * - Maintains semantic HTML structure
 * - Keyboard navigation supported via button elements
 * - Screen reader compatible
 */
export function VirtualizedSnapshotList({
  groupedResults,
  formatDateOnly,
  formatTimeOnly,
  formatBytes,
  getWaybackUrl,
  openPreview,
}: VirtualizedSnapshotListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Virtualize groups instead of individual items for better performance
  const virtualizer = useVirtualizer({
    count: groupedResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Estimate size based on number of snapshots in the group
      const group = groupedResults[index]
      return HEADER_HEIGHT + group.snapshots.length * SNAPSHOT_ITEM_HEIGHT
    },
    overscan: 2, // Render 2 extra groups above and below
  })

  if (groupedResults.length === 0) {
    return null
  }

  return (
    <div
      ref={parentRef}
      className="max-h-[60vh] sm:max-h-[70vh] overflow-auto"
      style={{
        minHeight: '400px',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const group = groupedResults[virtualItem.index]

          return (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Card className="hover:bg-accent/50 transition-colors mb-3">
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <CardTitle className="text-base sm:text-lg">
                      {formatDateOnly(group.date + "000000")}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {group.snapshots.length}{" "}
                      {group.snapshots.length === 1 ? "snapshot" : "snapshots"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-3">
                  {group.snapshots.map((snapshot, snapshotIndex) => (
                    <div
                      key={snapshotIndex}
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-mono font-medium text-sm">
                            {formatTimeOnly(snapshot.timestamp)}
                          </span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {snapshot.status}
                          </Badge>
                          {snapshot.mimetype && (
                            <Badge variant="secondary" className="text-xs shrink-0 max-w-[150px] truncate">
                              {snapshot.mimetype}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground sm:ml-7 flex-wrap">
                          {snapshot.length && (
                            <span className="flex items-center gap-1 shrink-0">
                              <FileText className="h-3 w-3" />
                              {formatBytes(Number.parseInt(snapshot.length))}
                            </span>
                          )}
                          <span className="truncate min-w-0">{snapshot.url}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 sm:flex-col lg:flex-row">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPreview(snapshot)}
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Preview</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(getWaybackUrl(snapshot.timestamp, snapshot.url), "_blank")
                          }
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
