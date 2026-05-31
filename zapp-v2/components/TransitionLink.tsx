"use client";

import { useTransitionNav } from "./TransitionProvider";

/**
 * An internal link that triggers the space-time portal transition instead of an
 * instant page swap. Behaves like a normal <a> (keyboard, middle-click, cmd-click
 * to open in new tab all still work).
 */
export function TransitionLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  onClick?: () => void;
}) {
  const go = useTransitionNav();
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        // respect new-tab / modifier clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onClick?.();
        go(href);
      }}
    >
      {children}
    </a>
  );
}
