import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/* Trustpilot's own star colours — third-party brand values, kept here rather
   than in the site's token set (same exception TrustpilotBadge makes). */
const GREEN = "#00b67a";
const EMPTY = "#dcdce6";

/**
 * Trustpilot's five-square star row, filled to `rating` (half-star steps),
 * used wherever this page points at the real Trustpilot profile. The profile's
 * TrustScore is 4.5, so that is the default — the row shows exactly what a
 * visitor will find when they click through, not a rounded-up five.
 *
 * Decorative: the link or text beside it carries the meaning.
 */
export default function TrustpilotStars({
  rating = 4.5,
  size = "md",
  className,
}: {
  rating?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const star = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <span className={cn("flex shrink-0 gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const pct = Math.round(fill * 100);
        return (
          <span
            key={i}
            className={cn("grid place-items-center rounded-[2px]", box)}
            style={{
              background: `linear-gradient(90deg, ${GREEN} ${pct}%, ${EMPTY} ${pct}%)`,
            }}
          >
            <Star fill="currentColor" className={cn("text-neutral-000", star)} />
          </span>
        );
      })}
    </span>
  );
}
