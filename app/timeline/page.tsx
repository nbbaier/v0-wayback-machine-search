"use client";

import { Calendar, Sparkles } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-primary/10 to-background dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="sticky top-0 z-20 border-gray-200 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <SearchHeader
            description="Visual journey through time"
            icon={Sparkles}
            iconBgClass="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600"
            title="TimeVault Timeline"
            titleGradient="from-purple-600 via-fuchsia-600 to-pink-600"
          />

          <SearchForm
            buttonClassName="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700"
            buttonText="Explore"
            isLoading={isLoading}
            onSearch={handleSearch}
            onSearchUrlChange={setSearchUrl}
            searchUrl={searchUrl}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {availableYears.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
              Filter by year:
            </span>
            <Badge
              className="cursor-pointer"
              onClick={() => setSelectedYear("")}
              variant={selectedYear === "" ? "default" : "secondary"}
            >
              All ({results.length})
            </Badge>
            {availableYears.map((year) => (
              <Badge
                className="cursor-pointer"
                key={year}
                onClick={() => setSelectedYear(year)}
                variant={selectedYear === year ? "default" : "secondary"}
              >
                {year} (
                {results.filter((r) => r.timestamp.startsWith(year)).length})
              </Badge>
            ))}
          </div>
        )}

        {isLoading && (
          <LoadingState
            cardClassName="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800"
            iconClass="text-purple-600 dark:text-purple-400"
            message="Traveling through time..."
          />
        )}

        {isError && (
          <LoadingState
            cardClassName="border-red-300 dark:border-red-800"
            message="Failed to load timeline"
          />
        )}

        {!(urlParam || isLoading) && (
          <EmptyState
            cardClassName="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800"
            description="Enter a URL to visualize its history on the timeline"
            icon={Calendar}
            iconBgClass="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600"
            title="Start Your Journey"
            titleGradient="from-purple-600 via-fuchsia-600 to-pink-600"
          />
        )}

        {!isLoading && results.length === 0 && urlParam && <NoResultsState />}

        {groupedByYearMonth.length > 0 && !isLoading && (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-linear-to-b from-primary via-accent to-primary md:left-1/2" />

            <div className="space-y-8">
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
