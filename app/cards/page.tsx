"use client";

import { Calendar, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import { EmptyState, LoadingState } from "@/components/search/search-states";
import { CardsDateGroup } from "@/components/snapshot/cards-date-group";
import { useWaybackSearch } from "@/lib/hooks/use-wayback-search";
import type { GroupedSnapshot } from "@/lib/types/archive";
import { cleanUrl } from "@/lib/utils/formatters";

export default function CardsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";

  const [searchUrl, setSearchUrl] = useState(urlParam);
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);

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
    router.push(`/cards?url=${encodeURIComponent(searchUrl)}`);
  };

  const groupedByDate = useMemo(() => {
    let filtered = results;

    if (deferredFilter) {
      const lowerFilter = deferredFilter.toLowerCase();
      filtered = results.filter(
        (r) =>
          r.url.toLowerCase().includes(lowerFilter) ||
          r.timestamp.includes(deferredFilter) ||
          r.status.includes(deferredFilter) ||
          r.mimetype.toLowerCase().includes(lowerFilter)
      );
    }

    const groups = new Map<string, GroupedSnapshot>();

    for (const snapshot of filtered) {
      const dateKey = snapshot.timestamp.slice(0, 8);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, { date: dateKey, snapshots: [] });
      }
      groups.get(dateKey)?.snapshots.push(snapshot);
    }

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        snapshots: group.snapshots.sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        ),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [results, deferredFilter]);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
      <div className="sticky top-0 z-20 border-border border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <SearchHeader
            description="Snapshots grouped by date"
            icon={LayoutGrid}
            title="TimeVault Cards"
          />

          <SearchForm
            filter={filter}
            isLoading={isLoading}
            onFilterChange={setFilter}
            onSearch={handleSearch}
            onSearchUrlChange={setSearchUrl}
            searchUrl={searchUrl}
            showFilter={results.length > 0}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-0 pb-3">
        {isLoading && <LoadingState />}

        {isError && (
          <LoadingState
            cardClassName="border-destructive/50"
            message="Failed to load snapshots"
          />
        )}

        {!(urlParam || isLoading) && (
          <EmptyState
            description="Enter a URL to see snapshots grouped by date"
            icon={Calendar}
            title="Search the Archive"
          />
        )}

        {groupedByDate.length > 0 && !isLoading && (
          <div className="mb-6">
            <output className="text-muted-foreground text-sm">
              Found{" "}
              {groupedByDate.reduce((acc, g) => acc + g.snapshots.length, 0)}{" "}
              snapshots across {groupedByDate.length} days
              {filter && " (filtered)"}
            </output>
          </div>
        )}

        <div className="space-y-4">
          {groupedByDate.map((group) => (
            <CardsDateGroup group={group} key={group.date} />
          ))}
        </div>
      </div>
    </div>
  );
}
