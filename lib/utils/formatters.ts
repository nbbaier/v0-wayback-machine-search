/**
 * Formats a Wayback Machine timestamp into a human-readable date and time string
 *
 * Converts timestamps from the CDX API format (YYYYMMDDHHmmss) into a localized
 * date and time string suitable for display to users.
 *
 * @param timestamp - A timestamp string in the format YYYYMMDDHHmmss (e.g., "20210315120000")
 * @returns A formatted date string with month, day, year, hour, and minute (e.g., "March 15, 2021, 12:00 PM")
 *
 * @example
 * ```typescript
 * formatDate("20210315120000")
 * // Returns: "March 15, 2021, 12:00 PM"
 *
 * formatDate("19990101000000")
 * // Returns: "January 1, 1999, 12:00 AM"
 * ```
 *
 * @remarks
 * - Uses en-US locale for formatting
 * - Timestamp is assumed to be in UTC
 * - Invalid timestamps may produce unexpected results
 */
export const formatDate = (timestamp: string) => {
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
