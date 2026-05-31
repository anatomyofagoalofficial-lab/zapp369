import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The one-line footer risk disclaimer. The FULL MiCA disclosure lives only on
 * the whitepaper page (Section IX). This is the single-line pointer to it.
 */
export function RiskDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-present-white/40", className)}>
      ⚡ZAPP is a community/culture memecoin, not an investment, security, or
      financial advice. It can lose all value.{" "}
      <Link
        href="/whitepaper#honest-words"
        className="text-present-white/60 underline underline-offset-2 transition-colors hover:text-present-white"
      >
        Read the honest words →
      </Link>
    </p>
  );
}
