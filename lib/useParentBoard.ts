"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type Entry, parseEntry, type ParsedEntry } from "@/lib/parents";
import { buildSampleEntries } from "@/lib/parentsSample";

/**
 * Shared fetch/parse for the `/api/parent-ticket/public` feed — used by the
 * board (components/AssistFamilyBoard.tsx), the departures strip
 * (components/AssistFamilyDepartures.tsx) and the per-listing detail page,
 * so all three read the same relay the same way instead of three copies of
 * this effect drifting apart.
 *
 * SOURCE, AND WHY IT MATTERS. The relay's upstream portal is currently
 * returning 404, so in practice every one of those surfaces was rendering an
 * error panel. A board that is permanently empty is worse than no board: it
 * tells a first-time visitor the service is dead. So the hook reports which
 * of two sources it settled on, and the UI says so plainly:
 *
 *   source: "live"    real, already-anonymised entries from the relay
 *   source: "sample"  the worked examples in lib/parentsSample.ts, shown
 *                     only when the relay errors or returns zero entries
 *
 * The examples are never silently mixed into live data — it is one or the
 * other, live always wins, and each sample entry carries `isSample` so a
 * card can tag itself. `feedError` keeps the real failure available for the
 * one place that still needs to surface it honestly (the detail page, where
 * "we couldn't load your listing" is not interchangeable with an example).
 */

export type BoardSource = "live" | "sample";

export type BoardState =
  | { status: "loading" }
  | {
      status: "ready";
      entries: ParsedEntry[];
      source: BoardSource;
      /** Set when the relay failed and the examples stood in for it. */
      feedError?: "rate_limited" | "generic";
    };

const NO_ENTRIES: ParsedEntry[] = [];

function parseRows(rows: unknown[]): ParsedEntry[] {
  return rows
    .filter((e): e is Entry => !!e && typeof e === "object" && !Array.isArray(e))
    .map(parseEntry);
}

function sampleState(feedError?: "rate_limited" | "generic"): BoardState {
  return {
    status: "ready",
    source: "sample",
    entries: parseRows(buildSampleEntries()),
    feedError,
  };
}

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
          // Fall through to the failure branch below.
        }

        const payload = (data ?? {}) as {
          ok?: unknown;
          error?: unknown;
          entries?: unknown;
        };

        if (res.status === 429 || payload.error === "rate_limited") {
          settle(sampleState("rate_limited"));
          return;
        }
        if (!res.ok || payload.ok !== true || !Array.isArray(payload.entries)) {
          settle(sampleState("generic"));
          return;
        }

        const rows = parseRows(payload.entries as unknown[]);

        // A genuinely empty live board is still an empty board to a visitor,
        // so the examples cover that case too — but without a feedError,
        // because nothing actually failed.
        settle(
          rows.length > 0
            ? { status: "ready", entries: rows, source: "live" }
            : sampleState()
        );
      } catch {
        settle(sampleState("generic"));
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

  const source: BoardSource | undefined =
    state.status === "ready" ? state.source : undefined;

  return { state, entries, source, reload };
}
