export type ReadStatus = "unread" | "in-progress" | "read";

export function nextStatus(current: ReadStatus): ReadStatus {
  if (current === "unread") return "in-progress";
  if (current === "in-progress") return "read";
  return "unread";
}
