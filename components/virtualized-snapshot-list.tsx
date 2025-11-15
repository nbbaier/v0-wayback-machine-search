"use client"

import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, Eye, FileText } from "lucide-react"

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

interface VirtualizedSnapshotListProps {
  groupedResults: GroupedSnapshot[]
  formatDateOnly: (timestamp: string) => string
  formatTimeOnly: (timestamp: string) => string
  formatBytes: (bytes: number) => string
  getWaybackUrl: (timestamp: string, url: string) => string
  openPreview: (snapshot: ArchiveResult) => void
}

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
      return 120 + group.snapshots.length * 100 // Header + snapshots
    },
    overscan: 2, // Render 2 extra groups above and below
  })

  if (groupedResults.length === 0) {
    return null
  }

  return (
    <div
      ref={parentRef}
      style={{
        height: '70vh',
        maxHeight: '1000px',
        overflow: 'auto',
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
              <Card className="hover:bg-accent/50 transition-colors mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {formatDateOnly(group.date + "000000")}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-auto">
                      {group.snapshots.length}{" "}
                      {group.snapshots.length === 1 ? "snapshot" : "snapshots"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.snapshots.map((snapshot, snapshotIndex) => (
                    <div
                      key={snapshotIndex}
                      className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-mono font-medium">
                            {formatTimeOnly(snapshot.timestamp)}
                          </span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {snapshot.status}
                          </Badge>
                          {snapshot.mimetype && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {snapshot.mimetype}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground ml-7">
                          {snapshot.length && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {formatBytes(Number.parseInt(snapshot.length))}
                            </span>
                          )}
                          <span className="truncate">{snapshot.url}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => openPreview(snapshot)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(getWaybackUrl(snapshot.timestamp, snapshot.url), "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
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
