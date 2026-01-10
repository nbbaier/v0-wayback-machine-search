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
			<form
				className="flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					onSearch();
				}}
			>
				<Input
					placeholder="https://example.com"
					value={searchUrl}
					onChange={(e) => onSearchUrlChange(e.target.value)}
					className="flex-1"
					type="url"
					inputMode="url"
					aria-label="Search URL"
				/>
				<Button
					type="submit"
					disabled={isLoading}
					className={buttonClassName}
					aria-busy={isLoading}
				>
					{isLoading ? buttonLoadingText : buttonText}
				</Button>
			</form>

			{showFilter && onFilterChange && (
				<Input
					placeholder="Filter snapshots..."
					value={filter || ""}
					onChange={(e) => onFilterChange(e.target.value)}
					className="w-full"
					aria-label="Filter snapshots"
				/>
			)}
		</div>
	);
}
