import { ExternalLink } from "lucide-react";
import type { ArchiveResult } from "@/lib/types/archive";
import {
	formatBytesCompact,
	formatTimestampShort,
} from "@/lib/utils/formatters";

interface TableSnapshotRowProps {
	snapshot: ArchiveResult;
	index: number;
}

export function TableSnapshotRow({ snapshot, index }: TableSnapshotRowProps) {
	return (
		<tr className="hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-orange-50/50 dark:hover:from-yellow-950/20 dark:hover:to-orange-950/20 transition-colors">
			<td className="px-4 py-2 text-gray-500 dark:text-gray-400 font-mono text-xs">
				{index + 1}
			</td>
			<td className="px-4 py-2 font-mono text-xs">
				{formatTimestampShort(snapshot.timestamp)}
			</td>
			<td className="px-4 py-2">
				<span
					className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
						snapshot.status === "200"
							? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
							: snapshot.status.startsWith("3")
								? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
								: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
					}`}
				>
					{snapshot.status}
				</span>
			</td>
			<td className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
				{snapshot.mimetype}
			</td>
			<td className="px-4 py-2 text-xs font-mono text-gray-600 dark:text-gray-400">
				{formatBytesCompact(snapshot.length)}
			</td>
			<td className="px-4 py-2">
				<a
					href={`https://web.archive.org/web/${snapshot.timestamp}/${snapshot.url}`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
				>
					<ExternalLink className="h-3 w-3" />
					View
				</a>
			</td>
		</tr>
	);
}
