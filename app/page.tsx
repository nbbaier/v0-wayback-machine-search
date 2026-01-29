"use client";

import { Calendar, Clock, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CardsView } from "@/components/search/cards-view";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import {
  EmptyState,
  LoadingState,
  NoResultsState,
} from "@/components/search/search-states";
import { TimelineView } from "@/components/search/timeline-view";
import { ViewToggle } from "@/components/view-toggle";
import { useWaybackSearch } from "@/lib/hooks/use-wayback-search";
import { cleanUrl } from "@/lib/utils/formatters";

type ViewMode = "cards" | "timeline";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";
  const viewParam = (searchParams.get("view") as ViewMode) || "cards";

  const [searchUrl, setSearchUrl] = useState(urlParam);
  const [view, setView] = useState<ViewMode>(viewParam);

  useEffect(() => {
    setSearchUrl(urlParam);
  }, [urlParam]);

  useEffect(() => {
    setView(viewParam);
  }, [viewParam]);

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
    const params = new URLSearchParams();
    params.set("url", searchUrl);
    params.set("view", view);
    router.push(`/?${params.toString()}`);
  };

  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    if (urlParam) {
      const params = new URLSearchParams();
      params.set("url", urlParam);
      params.set("view", newView);
      router.push(`/?${params.toString()}`);
    }
  };

  const isCards = view === "cards";
  const headerIcon = isCards ? LayoutGrid : Clock;
  const headerTitle = isCards ? "TimeVault" : "TimeVault Timeline";
  const headerDescription = isCards
    ? "Explore the web's archived history"
    : "Visual journey through time";

  const showEmptyState = !(urlParam || isLoading);
  const showNoResults = !isLoading && results.length === 0 && urlParam;
  const showResults = !isLoading && results.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="mb-4 flex items-start justify-between">
            <SearchHeader
              description={headerDescription}
              icon={headerIcon}
              title={headerTitle}
            />
            <ViewToggle onViewChange={handleViewChange} view={view} />
          </div>

          <SearchForm
            isLoading={isLoading}
            onSearch={handleSearch}
            onSearchUrlChange={setSearchUrl}
            searchUrl={searchUrl}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {isLoading && (
          <LoadingState
            message={isCards ? "Loading..." : "Loading timeline..."}
          />
        )}

        {isError && (
          <LoadingState
            cardClassName="border-l-destructive"
            message={
              isCards ? "Failed to load snapshots" : "Failed to load timeline"
            }
          />
        )}

        {showEmptyState && (
          <EmptyState
            description={
              isCards
                ? "Enter a URL to explore its past versions"
                : "Enter a URL to visualize its history"
            }
            icon={Calendar}
            title={isCards ? "Search the Archive" : "Explore the Timeline"}
          />
        )}

        {showNoResults && <NoResultsState />}

        {showResults && isCards && <CardsView results={results} />}
        {showResults && !isCards && <TimelineView results={results} />}
      </div>
    </div>
  );
}
