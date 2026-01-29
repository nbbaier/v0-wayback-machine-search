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
          aria-label="Search URL"
          className="flex-1"
          inputMode="url"
          onChange={(e) => onSearchUrlChange(e.target.value)}
          placeholder="https://example.com"
          type="url"
          value={searchUrl}
        />
        <Button
          aria-busy={isLoading}
          className={buttonClassName}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? buttonLoadingText : buttonText}
        </Button>
      </form>

      {showFilter && onFilterChange && (
        <Input
          aria-label="Filter snapshots"
          className="w-full"
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter snapshots..."
          value={filter || ""}
        />
      )}
    </div>
  );
}
