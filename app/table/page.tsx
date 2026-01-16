"use client";

import { Table2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import {
	EmptyState,
	ErrorState,
	LoadingState,
	NoResultsState,
} from "@/components/search/search-states";
import { VirtualizedTable } from "@/components/snapshot/virtualized-table";
import { Input } from "@/components/ui/input";
import { useWaybackSearch } from "@/lib/hooks/useWaybackSearch";
import type { SortColumn, SortDirection } from "@/lib/types/archive";
import { cleanUrl } from "@/lib/utils/formatters";

export default function TableSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlParam = searchParams.get("url") || "";

	const [searchUrl, setSearchUrl] = useState(urlParam);
	const [filter, setFilter] = useState("");
	// Defer the filter value to keep the UI responsive while filtering occurs
	const deferredFilter = useDeferredValue(filter);
	const [sortColumn, setSortColumn] = useState<SortColumn>("timestamp");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const tableRef = useRef<HTMLTableElement>(null);
	const [_tableOffset, setTableOffset] = useState(0);

	useEffect(() => {
		setSearchUrl(urlParam);
	}, [urlParam]);

	// Update offset when results change or on mount, to ensure virtualization starts correctly
	useEffect(() => {
		const updateOffset = () => {
			if (tableRef.current) {
				setTableOffset(tableRef.current.offsetTop);
			}
		};
		updateOffset();
		window.addEventListener("resize", updateOffset);
		return () => window.removeEventListener("resize", updateOffset);
	}, []);

	const queryParams = useMemo(() => {
		if (!urlParam) return null;
		return { url: cleanUrl(urlParam) };
	}, [urlParam]);

	const { data: results, isLoading, isError } = useWaybackSearch(queryParams);

	const handleSearch = () => {
		if (!searchUrl.trim()) return;
		router.push(`/table?url=${encodeURIComponent(searchUrl)}`);
	};

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const sortedAndFilteredResults = useMemo(() => {
		let filtered = results;

		if (deferredFilter) {
			filtered = results.filter(
				(r) =>
					r.url.toLowerCase().includes(deferredFilter.toLowerCase()) ||
					r.timestamp.includes(deferredFilter) ||
					r.status.includes(deferredFilter) ||
					r.mimetype.toLowerCase().includes(deferredFilter.toLowerCase()),
			);
		}

		return [...filtered].sort((a, b) => {
			let aVal: string | number = a[sortColumn] || "";
			let bVal: string | number = b[sortColumn] || "";

			if (sortColumn === "length") {
				aVal = Number.parseInt(a.length || "0", 10);
				bVal = Number.parseInt(b.length || "0", 10);
			}

			if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
			if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [results, deferredFilter, sortColumn, sortDirection]);

	// const virtualizer = useWindowVirtualizer({
	// 	count: sortedAndFilteredResults.length,
	// 	estimateSize: () => 53, // Approximate height of a row
	// 	overscan: 10,
	// 	scrollMargin: tableOffset,
	// });

	// const virtualItems = virtualizer.getVirtualItems();
	// const totalSize = virtualizer.getTotalSize();

	// const paddingTop =
	// 	virtualItems.length > 0 ? virtualItems[0].start - tableOffset : 0;
	// const paddingBottom =
	// 	virtualItems.length > 0
	// 		? totalSize - virtualItems[virtualItems.length - 1].end
	// 		: 0;

	return (
		<div className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-gray-900">
			<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<SearchHeader
						title="TimeVault Table"
						description="Spreadsheet-style archive browser"
						icon={Table2}
						iconBgClass="bg-gradient-to-br from-yellow-500 to-orange-600"
						titleGradient="from-yellow-600 to-orange-600"
					/>

					<SearchForm
						searchUrl={searchUrl}
						onSearchUrlChange={setSearchUrl}
						onSearch={handleSearch}
						isLoading={isLoading}
						buttonText="Search"
						buttonClassName="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
					/>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 py-4">
				{results.length > 0 && (
					<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 shadow-lg shadow-yellow-500/10">
						<div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="text-sm font-medium">
									{sortedAndFilteredResults.length} of {results.length}{" "}
									snapshots
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

				{isLoading && (
					<LoadingState
						iconClass="text-yellow-600 dark:text-yellow-400"
						cardClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 shadow-lg shadow-yellow-500/10"
					/>
				)}

				{isError && (
					<ErrorState
						message="Error loading data"
						subtitle="Please try again"
						cardClassName="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
					/>
				)}

				{!isLoading && results.length === 0 && urlParam && (
					<NoResultsState message="No archives found" />
				)}

				{sortedAndFilteredResults.length > 0 && !isLoading && (
					<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden shadow-xl shadow-yellow-500/20">
						<VirtualizedTable
							data={sortedAndFilteredResults}
							sortColumn={sortColumn}
							sortDirection={sortDirection}
							onSort={handleSort}
						/>
					</div>
				)}

				{!urlParam && !isLoading && (
					<EmptyState
						icon={Table2}
						title="Enter a URL to start searching"
						description="Results will appear in a sortable table format"
						iconBgClass="bg-gradient-to-br from-yellow-500 to-orange-600"
						cardClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-yellow-200 dark:border-yellow-800 shadow-lg shadow-yellow-500/10"
					/>
				)}
			</div>
		</div>
	);
}
