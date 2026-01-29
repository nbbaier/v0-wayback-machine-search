import { Search } from "lucide-react";
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
}

export function SearchForm({
  searchUrl,
  onSearchUrlChange,
  onSearch,
  isLoading,
  filter,
  onFilterChange,
  showFilter = false,
}: SearchFormProps) {
  return (
    <div className="space-y-4">
      <form
        className="flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <Input
          aria-label="Search URL"
          className="flex-1"
          inputMode="url"
          onChange={(e) => onSearchUrlChange(e.target.value)}
          placeholder="Enter URL to explore its past versions..."
          type="url"
          value={searchUrl}
        />
        <Button aria-busy={isLoading} disabled={isLoading} type="submit">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isLoading ? "Searching..." : "Search Archive"}
          </span>
        </Button>
      </form>

      {showFilter && onFilterChange && (
        <Input
          aria-label="Filter snapshots"
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter snapshots..."
          value={filter || ""}
        />
      )}
    </div>
  );
}
