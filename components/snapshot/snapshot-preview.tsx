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

  let icon = <FileText className="h-8 w-8 text-gray-600" />;
  if (isImage) {
    icon = <Image className="h-8 w-8 text-purple-600" />;
  } else if (isHtml) {
    icon = <FileText className="h-8 w-8 text-blue-600" />;
  }

  return (
    <div
      className={`flex h-24 w-full shrink-0 items-center justify-center rounded bg-linear-to-br from-purple-100 to-blue-100 sm:w-32 dark:from-purple-900/20 dark:to-blue-900/20 ${className}`}
    >
      {icon}
    </div>
  );
}
