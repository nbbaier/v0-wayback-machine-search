"use client";

import { Calendar, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import {
  EmptyState,
  LoadingState,
  NoResultsState,
} from "@/components/search/search-states";
import { TimelineGroup } from "@/components/snapshot/timeline-group";
import { useWaybackSearch } from "@/lib/hooks/use-wayback-search";
import type { GroupedSnapshotByMonth } from "@/lib/types/archive";
import { cleanUrl } from "@/lib/utils/formatters";

export default function TimelineSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";

  const [searchUrl, setSearchUrl] = useState(urlParam);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    setSearchUrl(urlParam);
  }, [urlParam]);

  const queryParams = useMemo(() => {
    if (!urlParam) {
      return null;
    }
    return { url: cleanUrl(urlParam) };
  }, [urlParam]);

  const { data: results, isLoading, isError } = useWaybackSearch(queryParams);

  const handleSearch = () => {
    if (!searchUrl.trim()) {
      return;
    }
    router.push(`/timeline?url=${encodeURIComponent(searchUrl)}`);
  };

  const groupedByYearMonth = useMemo(() => {
    const groups = new Map<string, GroupedSnapshotByMonth>();

    let filtered = results;
    if (selectedYear) {
      filtered = results.filter((r) => r.timestamp.startsWith(selectedYear));
    }

    for (const snapshot of filtered) {
      const year = snapshot.timestamp.slice(0, 4);
      const month = snapshot.timestamp.slice(4, 6);
      const key = `${year}-${month}`;

      if (!groups.has(key)) {
        groups.set(key, { year, month, snapshots: [] });
      }
      groups.get(key)?.snapshots.push(snapshot);
    }

    return Array.from(groups.values()).sort((a, b) =>
      `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`)
    );
  }, [results, selectedYear]);

  const availableYears = useMemo(() => {
    const years = new Set(results.map((r) => r.timestamp.slice(0, 4)));
    return Array.from(years).sort().reverse();
  }, [results]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <SearchHeader
            description="Visual journey through time"
            icon={Clock}
            title="TimeVault Timeline"
          />

          <SearchForm
            isLoading={isLoading}
            onSearch={handleSearch}
            onSearchUrlChange={setSearchUrl}
            searchUrl={searchUrl}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {availableYears.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Filter by year:
            </span>
            <button
              className={`text-sm ${selectedYear === "" ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setSelectedYear("")}
              type="button"
            >
              All ({results.length})
            </button>
            {availableYears.map((year) => (
              <button
                className={`text-sm ${selectedYear === year ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}
                key={year}
                onClick={() => setSelectedYear(year)}
                type="button"
              >
                {year} (
                {results.filter((r) => r.timestamp.startsWith(year)).length})
              </button>
            ))}
          </div>
        )}

        {isLoading && <LoadingState message="Loading timeline..." />}

        {isError && <LoadingState message="Failed to load timeline" />}

        {!(urlParam || isLoading) && (
          <EmptyState
            description="Enter a URL to visualize its history"
            icon={Calendar}
            title="Explore the Timeline"
          />
        )}

        {!isLoading && results.length === 0 && urlParam && <NoResultsState />}

        {groupedByYearMonth.length > 0 && !isLoading && (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-px bg-border md:left-1/2" />

            <div className="space-y-6">
              {groupedByYearMonth.map((group, groupIdx) => (
                <TimelineGroup
                  group={group}
                  groupIdx={groupIdx}
                  key={`${group.year}-${group.month}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
