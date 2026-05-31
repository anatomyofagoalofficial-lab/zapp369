"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

/** Copy-to-clipboard button with a brief confirmation state. */
export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-300",
        copied
          ? "border-present-green/60 text-present-green"
          : "border-present-yellow/50 text-present-yellow hover:bg-present-yellow hover:text-present-black",
        className,
      )}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
