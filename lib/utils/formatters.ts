/**
 * Formats a Wayback Machine timestamp into a human-readable date and time string
 * @param timestamp - A timestamp string in the format YYYYMMDDHHmmss (e.g., "20210315120000")
 * @returns A formatted date string with month, day, year, hour, and minute
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
