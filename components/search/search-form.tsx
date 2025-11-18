import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
	searchUrl: string;
	onSearchUrlChange: (value: string) => void;
	onSearch: () => void;
	isLoading: boolean;
	filter?: string;
	onFilterChange?: (value: string) => void;
	showFilter?: boolean;
	buttonText?: string;
	buttonLoadingText?: string;
	buttonClassName?: string;
}

export function SearchForm({
	searchUrl,
	onSearchUrlChange,
	onSearch,
	isLoading,
	filter,
	onFilterChange,
	showFilter = false,
	buttonText = "Search",
	buttonLoadingText = "Searching...",
	buttonClassName = "bg-primary hover:opacity-90",
}: SearchFormProps) {
	return (
		<div className="space-y-3">
			<div className="flex gap-2">
				<Input
					placeholder="https://example.com"
					value={searchUrl}
					onChange={(e) => onSearchUrlChange(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && onSearch()}
					className="flex-1"
				/>
				<Button
					onClick={onSearch}
					disabled={isLoading}
					className={buttonClassName}
				>
					{isLoading ? buttonLoadingText : buttonText}
				</Button>
			</div>

			{showFilter && onFilterChange && (
				<Input
					placeholder="Filter snapshots..."
					value={filter || ""}
					onChange={(e) => onFilterChange(e.target.value)}
					className="w-full"
				/>
			)}
		</div>
	);
}
