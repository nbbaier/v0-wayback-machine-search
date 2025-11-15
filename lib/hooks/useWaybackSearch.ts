import useSWR from 'swr'

interface WaybackSearchParams {
  url: string
  from?: string
  to?: string
}

interface ArchiveResult {
  url: string
  timestamp: string
  title: string
  status: string
  mimetype: string
  length?: string
}

const formatDate = (timestamp: string) => {
  const year = timestamp.slice(0, 4)
  const month = timestamp.slice(4, 6)
  const day = timestamp.slice(6, 8)
  const hour = timestamp.slice(8, 10)
  const minute = timestamp.slice(10, 12)

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const fetcher = async (url: string): Promise<ArchiveResult[]> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const data = await response.json()

  // Validate that the response is an array
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: expected an array')
  }

  // Handle empty array or array with only header row
  if (data.length <= 1) {
    return []
  }

  // Transform the CDX API response into our snapshot format
  const snapshots = data.slice(1).map((row: string[]) => {
    // Validate that each row is an array with expected structure
    if (!Array.isArray(row) || row.length < 5) {
      throw new Error('Invalid API response: malformed data row')
    }

    return {
      timestamp: row[0],
      url: row[1],
      status: row[2],
      mimetype: row[3],
      length: row[4],
      title: `Snapshot from ${formatDate(row[0])}`,
    }
  })

  return snapshots
}

export function useWaybackSearch(params: WaybackSearchParams | null) {
  // Build the API URL with query parameters
  const apiUrl = params
    ? (() => {
        const url = new URL("/api/wayback", window.location.origin)
        url.searchParams.set("url", params.url)
        if (params.from) {
          url.searchParams.set("from", params.from)
        }
        if (params.to) {
          url.searchParams.set("to", params.to)
        }
        return url.toString()
      })()
    : null

  // Use SWR for data fetching with caching
  // Only fetch if apiUrl is not null (params are provided)
  const { data, error, isLoading } = useSWR<ArchiveResult[]>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when window regains focus
      revalidateOnReconnect: false, // Don't refetch when internet reconnects
      dedupingInterval: 60000, // Dedupe requests within 60 seconds
      keepPreviousData: true, // Keep previous data while fetching new data
    }
  )

  return {
    data: data || [],
    isLoading,
    isError: !!error,
    error,
  }
}
