import useSWR from "swr";
import { formatDate } from "@/lib/utils/formatters";

/**
 * Parameters for searching the Wayback Machine archive
 */
interface WaybackSearchParams {
  /** The URL to search for (with or without protocol) */
  url: string;
  /** Start year in YYYY format (optional) */
  from?: string;
  /** End year in YYYY format (optional) */
  to?: string;
}

/**
 * Represents a single archived snapshot from the Wayback Machine
 */
interface ArchiveResult {
  /** The archived URL */
  url: string;
  /** Capture timestamp in YYYYMMDDHHmmss format */
  timestamp: string;
  /** Human-readable title (e.g., "Snapshot from Jan 1, 2024") */
  title: string;
  /** HTTP status code (e.g., "200", "404") */
  status: string;
  /** MIME type of the content (e.g., "text/html") */
  mimetype: string;
  /** Content length in bytes (optional) */
  length?: string;
}

/**
 * Fetches and transforms snapshot data from the Wayback Machine API
 *
 * @param url - The API endpoint URL with query parameters
 * @returns Promise resolving to array of archive results
 * @throws Error if the API request fails or returns invalid data
 *
 * @internal
 */
const fetcher = async (url: string): Promise<ArchiveResult[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Validate that the response is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: expected an array");
  }

  // Handle empty array or array with only header row
  if (data.length <= 1) {
    return [];
  }

  // Transform the CDX API response into our snapshot format
  const snapshots = data
    .slice(1)
    .reduce((acc: ArchiveResult[], row: string[]) => {
      // Validate that each row is an array with expected structure
      if (!Array.isArray(row) || row.length < 5) {
        console.warn("Invalid API response: malformed data row", row);
        return acc;
      }

      acc.push({
        timestamp: row[0],
        url: row[1],
        status: row[2],
        mimetype: row[3],
        length: row[4],
        title: `Snapshot from ${formatDate(row[0])}`,
      });
      return acc;
    }, []);

  return snapshots;
};

/**
 * Custom hook for searching the Wayback Machine archive with SWR caching
 *
 * This hook provides a declarative interface for fetching archived snapshots
 * from the Wayback Machine CDX API via our internal proxy endpoint. It includes
 * automatic caching, request deduplication, and error handling.
 *
 * @param params - Search parameters including URL and optional date range, or null to skip fetching
 * @returns Object containing snapshot data, loading state, and error information
 *
 * @example
 * ```tsx
 * // Basic search
 * const { data, isLoading, isError } = useWaybackSearch({
 *   url: 'example.com'
 * })
 *
 * // Search with year filter
 * const { data, isLoading, isError } = useWaybackSearch({
 *   url: 'example.com',
 *   from: '2020',
 *   to: '2024'
 * })
 *
 * // Conditional fetching
 * const { data } = useWaybackSearch(
 *   hasUrl ? { url: 'example.com' } : null
 * )
 * ```
 *
 * @remarks
 * - Results are cached client-side with a 60-second deduplication window
 * - Requests are automatically deduplicated (identical requests share the same response)
 * - Previous data is maintained while new data is being fetched
 * - Returns empty array when params is null (no fetch occurs)
 * - The hook does NOT refetch on window focus or network reconnection
 */
export function useWaybackSearch(params: WaybackSearchParams | null) {
  // Build the API URL with query parameters
  // Using relative URL to avoid SSR crashes (window is not available server-side)
  const apiUrl = params
    ? (() => {
        const searchParams = new URLSearchParams({ url: params.url });
        if (params.from) {
          searchParams.set("from", params.from);
        }
        if (params.to) {
          searchParams.set("to", params.to);
        }
        return `/api/wayback?${searchParams.toString()}`;
      })()
    : null;

  // Use SWR for data fetching with caching
  // Only fetch if apiUrl is not null (params are provided)
  const { data, error, isLoading } = useSWR<ArchiveResult[]>(apiUrl, fetcher, {
    revalidateOnFocus: false, // Don't refetch when window regains focus
    revalidateOnReconnect: false, // Don't refetch when internet reconnects
    dedupingInterval: 60_000, // Dedupe requests within 60 seconds
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  return {
    /** Array of archive snapshots (empty if no data or still loading) */
    data: data || [],
    /** True while the initial fetch is in progress */
    isLoading,
    /** True if an error occurred during fetching */
    isError: !!error,
    /** The error object if an error occurred, undefined otherwise */
    error,
  };
}
