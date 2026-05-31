import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** Element to render as. Defaults to <span>. */
  as?: React.ElementType;
  className?: string;
  /** Optional separate styling for the ⚡ bolt (e.g. color it gold). */
  boltClassName?: string;
};

/**
 * The ⚡ZAPP brand mark — bolt on the left, no space, no exceptions.
 * Always render the mark through this component so it can never be typo'd.
 * The bolt is sized slightly smaller than the cap height and baseline-aligned,
 * per the typography rule. Screen readers announce "ZAPP" (the bolt is hidden),
 * while copy/paste and SEO still capture the full "⚡ZAPP".
 */
export function BrandMark({ as: Tag = "span", className, boltClassName }: BrandMarkProps) {
  return (
    <Tag className={cn("font-serif whitespace-nowrap", className)}>
      <span aria-hidden="true" className={cn("align-baseline text-[0.8em]", boltClassName)}>
        ⚡
      </span>
      ZAPP
    </Tag>
  );
}
