import { FileText, Image } from "lucide-react";

interface SnapshotPreviewProps {
	mimetype: string;
	className?: string;
}

export function SnapshotPreview({
	mimetype,
	className = "",
}: SnapshotPreviewProps) {
	const isImage = mimetype.includes("image");
	const isHtml = mimetype.includes("html");

	return (
		<div
			className={`w-full sm:w-32 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded flex items-center justify-center shrink-0 ${className}`}
		>
			{isImage ? (
				<Image className="h-8 w-8 text-purple-600" />
			) : isHtml ? (
				<FileText className="h-8 w-8 text-blue-600" />
			) : (
				<FileText className="h-8 w-8 text-gray-600" />
			)}
		</div>
	);
}
