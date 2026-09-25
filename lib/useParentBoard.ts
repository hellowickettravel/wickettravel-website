"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type Entry, parseEntry, type ParsedEntry } from "@/lib/parents";

/**
 * Shared fetch/parse for the live `/api/parent-ticket/public` feed — extracted
 * from components/ParentsBoard.tsx so the two
 * full list pages and the per-listing detail page all hit the same relay the
 * same way, instead of four independent copies of this effect drifting apart.
 * Nothing is mocked: an empty or failed feed is a real state, not a reason to
 * invent placeholder listings.
 */

export type BoardState =
  | { status: "loading" }
  | { status: "ready"; entries: ParsedEntry[] }
  | { status: "error"; kind: "rate_limited" | "generic" };

const NO_ENTRIES: ParsedEntry[] = [];

export function useParentBoard(limit = 50) {
  const [state, setState] = useState<BoardState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const settle = (next: BoardState) => {
      if (!cancelled) setState(next);
    };

    void (async () => {
      try {
        const res = await fetch(`/api/parent-ticket/public?limit=${limit}`, {
          headers: { Accept: "application/json" },
        });

        let data: unknown = null;
        try {
          data = await res.json();
        } catch {
          // Fall through to the generic error below.
        }

        const payload = (data ?? {}) as {
          ok?: unknown;
          error?: unknown;
          entries?: unknown;
        };

        if (res.status === 429 || payload.error === "rate_limited") {
          settle({ status: "error", kind: "rate_limited" });
          return;
        }
        if (!res.ok || payload.ok !== true || !Array.isArray(payload.entries)) {
          settle({ status: "error", kind: "generic" });
          return;
        }

        const rows = (payload.entries as unknown[])
          .filter(
            (e): e is Entry => !!e && typeof e === "object" && !Array.isArray(e)
          )
          .map(parseEntry);
        settle({ status: "ready", entries: rows });
      } catch {
        settle({ status: "error", kind: "generic" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit, reloadKey]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setReloadKey((k) => k + 1);
  }, []);

  const entries = useMemo(
    () => (state.status === "ready" ? state.entries : NO_ENTRIES),
    [state]
  );

  return { state, entries, reload };
}
