"use client";

import { Calendar, LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import { EmptyState, LoadingState } from "@/components/search/search-states";
import { CardsDateGroup } from "@/components/snapshot/cards-date-group";
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch";
import type { GroupedSnapshot } from "@/lib/types/archive";
import { cleanUrl } from "@/lib/utils/formatters";

export default function CardsSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlParam = searchParams.get("url") || "";

	const [searchUrl, setSearchUrl] = useState(urlParam);
	const [filter, setFilter] = useState("");

	useEffect(() => {
		setSearchUrl(urlParam);
	}, [urlParam]);

	const queryParams = useMemo(() => {
		if (!urlParam) return null;
		return { url: cleanUrl(urlParam) };
	}, [urlParam]);

	const { data: results, isLoading, isError } = useWaybackSearch(queryParams);

	const handleSearch = () => {
		if (!searchUrl.trim()) return;
		router.push(`/cards?url=${encodeURIComponent(searchUrl)}`);
	};

	const groupedByDate = useMemo(() => {
		let filtered = results;

		if (filter) {
			filtered = results.filter(
				(r) =>
					r.url.toLowerCase().includes(filter.toLowerCase()) ||
					r.timestamp.includes(filter) ||
					r.status.includes(filter) ||
					r.mimetype.toLowerCase().includes(filter.toLowerCase()),
			);
		}

		const groups = new Map<string, GroupedSnapshot>();

		filtered.forEach((snapshot) => {
			const dateKey = snapshot.timestamp.slice(0, 8);
			if (!groups.has(dateKey)) {
				groups.set(dateKey, { date: dateKey, snapshots: [] });
			}
			groups.get(dateKey)?.snapshots.push(snapshot);
		});

		return Array.from(groups.values())
			.map((group) => ({
				...group,
				snapshots: group.snapshots.sort((a, b) =>
					b.timestamp.localeCompare(a.timestamp),
				),
			}))
			.sort((a, b) => b.date.localeCompare(a.date));
	}, [results, filter]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
			<div className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<SearchHeader
						title="TimeVault Cards"
						description="Snapshots grouped by date"
						icon={LayoutGrid}
					/>

					<SearchForm
						searchUrl={searchUrl}
						onSearchUrlChange={setSearchUrl}
						onSearch={handleSearch}
						isLoading={isLoading}
						filter={filter}
						onFilterChange={setFilter}
						showFilter={results.length > 0}
					/>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 pt-0 pb-3">
				{isLoading && <LoadingState />}

				{isError && (
					<LoadingState
						message="Failed to load snapshots"
						cardClassName="border-destructive/50"
					/>
				)}

				{!urlParam && !isLoading && (
					<EmptyState
						icon={Calendar}
						title="Search the Archive"
						description="Enter a URL to see snapshots grouped by date"
					/>
				)}

				{groupedByDate.length > 0 && !isLoading && (
					<div className="mb-6">
						<p className="text-sm text-muted-foreground">
							Found{" "}
							{groupedByDate.reduce((acc, g) => acc + g.snapshots.length, 0)}{" "}
							snapshots across {groupedByDate.length} days
							{filter && " (filtered)"}
						</p>
					</div>
				)}

				<div className="space-y-4">
					{groupedByDate.map((group) => (
						<CardsDateGroup key={group.date} group={group} />
					))}
				</div>
			</div>
		</div>
	);
}
