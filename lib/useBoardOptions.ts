"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_BOARD_OPTIONS,
  sanitizeBoardOptions,
  type BoardOptions,
} from "@/lib/boardOptions";

/**
 * The board options an admin keeps in the portal, read once per page through
 * /api/parent-ticket/options. Renders with the built-in defaults straight
 * away (so server and first client render agree, and nothing waits on the
 * network), then swaps in the portal's lists when they arrive.
 */

let cache: BoardOptions | null = null;
let inflight: Promise<BoardOptions | null> | null = null;

function load(): Promise<BoardOptions | null> {
  if (!inflight) {
    inflight = fetch("/api/parent-ticket/options", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => sanitizeBoardOptions((d as { options?: unknown } | null)?.options))
      .catch(() => null)
      .then((o) => {
        cache = o;
        return o;
      });
  }
  return inflight;
}

export function useBoardOptions(): BoardOptions {
  const [options, setOptions] = useState<BoardOptions>(DEFAULT_BOARD_OPTIONS);

  useEffect(() => {
    let alive = true;
    // Resolved asynchronously, so the state update lands after the effect.
    void load().then((o) => {
      if (alive && o) setOptions(o);
    });
    return () => {
      alive = false;
    };
  }, []);

  return cache ?? options;
}
