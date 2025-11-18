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
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch";
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
		if (!urlParam) return null;
		return { url: cleanUrl(urlParam) };
	}, [urlParam]);

	const { data: results, isLoading, isError } = useWaybackSearch(queryParams);

	const handleSearch = () => {
		if (!searchUrl.trim()) return;
		router.push(`/timeline?url=${encodeURIComponent(searchUrl)}`);
	};

	const groupedByYearMonth = useMemo(() => {
		const groups = new Map<string, GroupedSnapshotByMonth>();

		let filtered = results;
		if (selectedYear) {
			filtered = results.filter((r) => r.timestamp.startsWith(selectedYear));
		}

		filtered.forEach((snapshot) => {
			const year = snapshot.timestamp.slice(0, 4);
			const month = snapshot.timestamp.slice(4, 6);
			const key = `${year}-${month}`;

			if (!groups.has(key)) {
				groups.set(key, { year, month, snapshots: [] });
			}
			groups.get(key)?.snapshots.push(snapshot);
		});

		return Array.from(groups.values()).sort((a, b) =>
			`${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`),
		);
	}, [results, selectedYear]);

	const availableYears = useMemo(() => {
		const years = new Set(results.map((r) => r.timestamp.slice(0, 4)));
		return Array.from(years).sort().reverse();
	}, [results]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
			<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<SearchHeader
						title="TimeVault Timeline"
						description="Visual journey through time"
						icon={Sparkles}
						iconBgClass="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600"
						titleGradient="from-purple-600 via-fuchsia-600 to-pink-600"
					/>

					<SearchForm
						searchUrl={searchUrl}
						onSearchUrlChange={setSearchUrl}
						onSearch={handleSearch}
						isLoading={isLoading}
						buttonText="Explore"
						buttonClassName="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700"
					/>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-6">
				{availableYears.length > 0 && (
					<div className="mb-6 flex flex-wrap gap-2 items-center">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Filter by year:
						</span>
						<Badge
							variant={selectedYear === "" ? "default" : "secondary"}
							className="cursor-pointer"
							onClick={() => setSelectedYear("")}
						>
							All ({results.length})
						</Badge>
						{availableYears.map((year) => (
							<Badge
								key={year}
								variant={selectedYear === year ? "default" : "secondary"}
								className="cursor-pointer"
								onClick={() => setSelectedYear(year)}
							>
								{year} (
								{results.filter((r) => r.timestamp.startsWith(year)).length})
							</Badge>
						))}
					</div>
				)}

				{isLoading && (
					<LoadingState
						message="Traveling through time..."
						iconClass="text-purple-600 dark:text-purple-400"
						cardClassName="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800"
					/>
				)}

				{isError && (
					<LoadingState
						message="Failed to load timeline"
						cardClassName="border-red-300 dark:border-red-800"
					/>
				)}

				{!urlParam && !isLoading && (
					<EmptyState
						icon={Calendar}
						title="Start Your Journey"
						description="Enter a URL to visualize its history on the timeline"
						iconBgClass="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600"
						titleGradient="from-purple-600 via-fuchsia-600 to-pink-600"
						cardClassName="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800"
					/>
				)}

				{!isLoading && results.length === 0 && urlParam && (
					<NoResultsState />
				)}

				{groupedByYearMonth.length > 0 && !isLoading && (
					<div className="relative">
						<div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-fuchsia-400 to-pink-400" />

						<div className="space-y-8">
							{groupedByYearMonth.map((group, groupIdx) => (
								<TimelineGroup
									key={`${group.year}-${group.month}`}
									group={group}
									groupIdx={groupIdx}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
