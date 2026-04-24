export type ReadStatus = "unread" | "in-progress" | "read";

const STATUS_KEY = "ai-hub-status";
const LEGACY_KEY = "ai-hub-read";
const RATINGS_KEY = "ai-hub-ratings";

export function getStatuses(): Record<string, ReadStatus> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STATUS_KEY);
    if (stored) return JSON.parse(stored) as Record<string, ReadStatus>;

    // Migrate from old format (string[]) where all items were "read"
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const ids = JSON.parse(legacy) as string[];
      const migrated: Record<string, ReadStatus> = {};
      for (const id of ids) migrated[id] = "read";
      localStorage.setItem(STATUS_KEY, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_KEY);
      return migrated;
    }

    return {};
  } catch {
    return {};
  }
}

export function setStatus(id: string, status: ReadStatus): void {
  const statuses = getStatuses();
  if (status === "unread") {
    delete statuses[id];
  } else {
    statuses[id] = status;
  }
  localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
}

export function getRatings(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(RATINGS_KEY);
    return stored ? (JSON.parse(stored) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function setRating(id: string, rating: number): void {
  const ratings = getRatings();
  if (rating === 0) {
    delete ratings[id];
  } else {
    ratings[id] = rating;
  }
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

export function nextStatus(current: ReadStatus): ReadStatus {
  if (current === "unread") return "in-progress";
  if (current === "in-progress") return "read";
  return "unread";
}
