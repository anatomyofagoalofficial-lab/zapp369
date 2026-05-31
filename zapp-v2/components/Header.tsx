"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { NAV } from "@/lib/constants";

/**
 * Site-wide fixed header. A subtle dark scrim sits behind it so the white mark
 * stays legible over any era — including the light Past page. Includes a mobile
 * menu.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-present-black/70 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="⚡ZAPP home">
          <BrandMark
            boltClassName="text-present-yellow"
            className="text-xl text-white transition-opacity hover:opacity-80"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-white/60 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white/80 transition-colors hover:text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <nav
          className="relative border-t border-white/10 bg-present-black/95 backdrop-blur md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col px-6 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 font-mono text-sm uppercase tracking-wider text-white/70 transition-colors last:border-0 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
