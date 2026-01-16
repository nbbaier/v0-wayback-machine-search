"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TableSnapshotRow } from "@/components/snapshot/table-snapshot-row";
import type {
	ArchiveResult,
	SortColumn,
	SortDirection,
} from "@/lib/types/archive";

interface VirtualizedTableProps {
	data: ArchiveResult[];
	sortColumn: SortColumn;
	sortDirection: SortDirection;
	onSort: (column: SortColumn) => void;
}

export function VirtualizedTable({
	data,
	sortColumn,
	sortDirection: _sortDirection,
	onSort,
}: VirtualizedTableProps) {
	const tableRef = useRef<HTMLTableElement>(null);
	const [tableOffset, setTableOffset] = useState(0);

	// Update table offset when mounted and on resize
	useEffect(() => {
		const updateOffset = () => {
			if (tableRef.current) {
				const rect = tableRef.current.getBoundingClientRect();
				const scrollTop = window.scrollY || document.documentElement.scrollTop;
				setTableOffset(rect.top + scrollTop);
			}
		};

		updateOffset();
		window.addEventListener("resize", updateOffset);

		// Also update after a short delay to account for layout shifts/images
		const timeout = setTimeout(updateOffset, 100);

		return () => {
			window.removeEventListener("resize", updateOffset);
			clearTimeout(timeout);
		};
	}, []);

	const virtualizer = useWindowVirtualizer({
		count: data.length,
		estimateSize: () => 48, // Approximate row height
		scrollMargin: tableOffset,
		overscan: 20, // Keep more items rendered for smoother scrolling
	});

	const virtualItems = virtualizer.getVirtualItems();

	const totalSize = virtualizer.getTotalSize();
	const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
	const paddingBottom =
		virtualItems.length > 0
			? totalSize - virtualItems[virtualItems.length - 1].end
			: 0;

	return (
		<div className="overflow-x-auto">
			<table ref={tableRef} className="w-full text-sm">
				<thead className="bg-linear-to-r from-yellow-100 via-orange-100 to-yellow-100 dark:from-yellow-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 border-b border-yellow-200 dark:border-yellow-700">
					<tr>
						<th className="px-4 py-3 text-left font-medium w-16">#</th>
						<th
							className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-40"
							onClick={() => onSort("timestamp")}
						>
							<div className="flex items-center gap-2">
								Timestamp
								{sortColumn === "timestamp" && (
									<ArrowUpDown className="h-3 w-3" />
								)}
							</div>
						</th>
						<th
							className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-24"
							onClick={() => onSort("status")}
						>
							<div className="flex items-center gap-2">
								Status
								{sortColumn === "status" && <ArrowUpDown className="h-3 w-3" />}
							</div>
						</th>
						<th
							className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-32"
							onClick={() => onSort("mimetype")}
						>
							<div className="flex items-center gap-2">
								MIME Type
								{sortColumn === "mimetype" && (
									<ArrowUpDown className="h-3 w-3" />
								)}
							</div>
						</th>
						<th
							className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-24"
							onClick={() => onSort("length")}
						>
							<div className="flex items-center gap-2">
								Size
								{sortColumn === "length" && <ArrowUpDown className="h-3 w-3" />}
							</div>
						</th>
						<th className="px-4 py-3 text-left font-medium w-24">Action</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-yellow-200/50 dark:divide-yellow-800/50">
					{paddingTop > 0 && (
						<tr style={{ height: `${paddingTop}px` }}>
							<td colSpan={6} />
						</tr>
					)}
					{virtualItems.map((virtualRow) => {
						const snapshot = data[virtualRow.index];
						return (
							<TableSnapshotRow
								key={`${snapshot.timestamp}-${snapshot.url}-${virtualRow.index}`}
								snapshot={snapshot}
								index={virtualRow.index}
							/>
						);
					})}
					{paddingBottom > 0 && (
						<tr style={{ height: `${paddingBottom}px` }}>
							<td colSpan={6} />
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
