export interface ArchiveResult {
  url: string;
  timestamp: string;
  title: string;
  status: string;
  mimetype: string;
  length?: string;
}

export type Snapshot = ArchiveResult;

export interface GroupedSnapshot {
  date: string;
  snapshots: ArchiveResult[];
}

export interface GroupedSnapshotByMonth {
  year: string;
  month: string;
  snapshots: ArchiveResult[];
}

export type SortColumn = "timestamp" | "status" | "mimetype" | "length";
export type SortDirection = "asc" | "desc";
