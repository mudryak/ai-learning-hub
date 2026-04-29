/**
 * Returns true if the given email is in the ADMIN_EMAILS env var.
 * ADMIN_EMAILS is a comma-separated list, e.g. "alice@example.com,bob@example.com"
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const admins = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
