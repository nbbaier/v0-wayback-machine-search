export const monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function formatTimestamp(ts: string): string {
	const year = ts.slice(0, 4);
	const month = ts.slice(4, 6);
	const day = ts.slice(6, 8);
	const hour = ts.slice(8, 10);
	const minute = ts.slice(10, 12);
	return `${monthNames[parseInt(month, 10) - 1]} ${day}, ${year} at ${hour}:${minute}`;
}

export function formatTimestampShort(ts: string): string {
	return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)} ${ts.slice(8, 10)}:${ts.slice(10, 12)}`;
}

export function formatDate(dateStr: string): string {
	const year = dateStr.slice(0, 4);
	const month = dateStr.slice(4, 6);
	const day = dateStr.slice(6, 8);
	const date = new Date(`${year}-${month}-${day}`);

	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatTime(timestamp: string): string {
	const hour = timestamp.slice(8, 10);
	const minute = timestamp.slice(10, 12);
	const second = timestamp.slice(12, 14);
	return `${hour}:${minute}:${second}`;
}

export function formatBytes(bytes: string | undefined): string {
	if (!bytes) return "Unknown";
	const num = parseInt(bytes, 10);
	if (num < 1024) return `${num}B`;
	if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`;
	return `${(num / (1024 * 1024)).toFixed(1)}MB`;
}

export function formatBytesMinimal(bytes: string | undefined): string {
	if (!bytes) return "—";
	const num = parseInt(bytes, 10);
	if (num < 1024) return `${num}B`;
	if (num < 1024 * 1024) return `${(num / 1024).toFixed(0)}KB`;
	return `${(num / (1024 * 1024)).toFixed(1)}MB`;
}

export function formatBytesCompact(bytes: string | undefined): string {
	if (!bytes) return "-";
	const num = parseInt(bytes, 10);
	if (num < 1024) return `${num}B`;
	if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`;
	return `${(num / (1024 * 1024)).toFixed(1)}MB`;
}

export function cleanUrl(url: string): string {
	let cleanUrl = url.trim();
	if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
		cleanUrl = `https://${cleanUrl}`;
	}
	return cleanUrl;
}
