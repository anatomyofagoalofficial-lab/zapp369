/**
 * Tiny class-name joiner — no external deps (clsx / tailwind-merge are
 * intentionally NOT used, per the locked stack). Filters out falsy values.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Shorten a Solana address for display: "Ab16ce…Cpump". */
export function truncateAddress(address: string, lead = 6, tail = 5): string {
  if (address.length <= lead + tail) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

/** Format a number with thousands separators (1000000 → "1,000,000"). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Format a USD amount compactly ($13K, $1.2M). Returns "—" for null. */
export function formatUsd(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Copy text to the clipboard. Returns true on success. Client-side only. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
