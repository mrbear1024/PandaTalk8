export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Thousands-separated reader count, e.g. 1234 -> "1,234".
export function formatViews(n: number): string {
  return Math.max(0, Math.floor(n)).toLocaleString("en-US");
}
