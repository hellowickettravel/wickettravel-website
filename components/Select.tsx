"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The site's own dropdown, replacing the browser's native <select> list
 * (client feedback, 2026-09-30: the grey OS menu looked out of place next
 * to everything else). Same vocabulary as the flight search's menus in
 * components/FlightSearch.tsx: white panel, 12px radius, E3 shadow, tinted
 * active row, orange check on the chosen option.
 *
 * BEHAVIOUR (WAI-ARIA listbox pattern)
 *   • The trigger is a real <button> with aria-haspopup/expanded/controls,
 *     so an external <label htmlFor> still points at it and a form can
 *     focus it on a validation error.
 *   • Open with click, Enter, Space, ↑ or ↓. Inside: ↑ ↓ Home End move,
 *     typing jumps to the first option that starts with the typed letters,
 *     Enter picks, Escape closes and hands focus back, Tab closes.
 *   • Long lists (more than 8 options) get a search box at the top.
 *
 * WHY A PORTAL. The board's filter rail scrolls on its own
 * (overflow-y: auto), and anything absolutely positioned inside a
 * scrolling box is clipped by it. The menu is portalled to <body> with
 * fixed coordinates taken from the trigger, re-measured on scroll and
 * resize, and flips upwards when there is no room below.
 */

export type SelectOption = {
  value: string;
  label: string;
  /** Secondary text on the right of the row, e.g. a count. */
  hint?: string;
  /** Rendered dimmer; still selectable. */
  muted?: boolean;
};

type Variant = "well" | "field" | "compact" | "toolbar";

const SEARCH_THRESHOLD = 8;
const MENU_MAX_HEIGHT = 320;
const GAP = 8;

const noopSubscribe = () => () => {};

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  emptyValue = "",
  variant = "field",
  label,
  icon: Icon,
  id,
  ariaLabel,
  disabled,
  className,
  menuMinWidth = 220,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** The value that means "nothing chosen" ("Any airline", "Any date").
   *  It renders as a placeholder: lighter and regular weight, so a real
   *  choice in bold navy is told apart at a glance. */
  emptyValue?: string;
  variant?: Variant;
  /** Visible label inside a "well" trigger. */
  label?: string;
  icon?: typeof Search;
  /** Put on the trigger so an outside <label htmlFor> can target it. */
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  menuMinWidth?: number;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const reduce = useReducedMotion();
  // The menu is portalled to <body>, which doesn't exist on the server; it
  // mounts once the client has hydrated.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
    up: boolean;
  } | null>(null);
  const typed = useRef({ text: "", at: 0 });

  const selected = options.find((o) => o.value === value);
  const searchable = options.length > SEARCH_THRESHOLD;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  /* ── Positioning ──────────────────────────────────────────────────── */
  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(Math.max(r.width, menuMinWidth), vw - 16);
    const left = Math.min(Math.max(8, r.left), vw - width - 8);
    const below = vh - r.bottom - GAP - 8;
    const above = r.top - GAP - 8;
    const up = below < Math.min(MENU_MAX_HEIGHT, 240) && above > below;
    const maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(160, up ? above : below));
    setPos(
      up
        ? { left, width, bottom: vh - r.top + GAP, maxHeight, up }
        : { left, width, top: r.bottom + GAP, maxHeight, up }
    );
  }, [menuMinWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    let frame = 0;
    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [open, measure]);

  /* ── Open / close ─────────────────────────────────────────────────── */
  const openMenu = (at?: "first" | "last") => {
    if (disabled) return;
    const idx = options.findIndex((o) => o.value === value);
    setQuery("");
    setActive(at === "first" ? 0 : at === "last" ? options.length - 1 : Math.max(0, idx));
    setOpen(true);
  };

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const commit = (option: SelectOption | undefined) => {
    if (!option) return;
    onChange(option.value);
    close(true);
  };

  // Focus moves into the menu once it has mounted: the search box when there
  // is one, otherwise the list itself (which carries aria-activedescendant).
  useEffect(() => {
    if (!open) return;
    // On a touch screen, focusing the search box would raise the keyboard
    // over the list, so the list takes focus and the box waits for a tap.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const t = window.setTimeout(() => {
      (searchable && !touch ? searchRef.current : listRef.current)?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, searchable]);

  // Click or tap outside closes without stealing focus back.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  /* ── Keyboard ─────────────────────────────────────────────────────── */
  const onMenuKey = (e: React.KeyboardEvent) => {
    const last = visible.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(last);
        return;
      case "Enter":
        e.preventDefault();
        commit(visible[active]);
        return;
      case "Escape":
        e.preventDefault();
        close(true);
        return;
      case "Tab":
        close(false);
        return;
    }
    // Type-ahead on the plain list (the search box handles its own typing).
    if (!searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      const buf = now - typed.current.at < 600 ? typed.current.text + e.key : e.key;
      typed.current = { text: buf, at: now };
      const hit = visible.findIndex((o) => o.label.toLowerCase().startsWith(buf.toLowerCase()));
      if (hit >= 0) setActive(hit);
    }
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    // Focus moves into the menu a tick after it opens; until it has, keys
    // pressed on the trigger belong to the menu.
    if (open) {
      // A letter typed before the search box has focus still belongs in it.
      if (searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setQuery((q) => q + e.key);
        setActive(0);
        searchRef.current?.focus({ preventScroll: true });
        return;
      }
      onMenuKey(e);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu("last");
    }
  };

  /* ── Trigger ──────────────────────────────────────────────────────── */
  const shown = selected?.label ?? placeholder;
  const isPlaceholder = !selected || selected.value === emptyValue;
  const valueTone = isPlaceholder
    ? "font-normal text-text-secondary"
    : "font-bold text-primary-800";

  const chevron = (
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200",
        open && "rotate-180 text-primary-800"
      )}
      aria-hidden="true"
    />
  );

  let body: ReactNode;
  if (variant === "well") {
    body = (
      <>
        {Icon && <Icon className="h-[18px] w-[18px] shrink-0 text-accent-500" aria-hidden="true" />}
        <span className="flex min-w-0 flex-1 flex-col py-2 text-left">
          {label && <span className="t-caption font-bold text-text-secondary">{label}</span>}
          <span className={cn("truncate font-sans text-[16px] leading-[22px]", valueTone)}>
            {shown}
          </span>
        </span>
        {chevron}
      </>
    );
  } else {
    body = (
      <>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />}
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            variant === "field"
              ? isPlaceholder
                ? "text-text-secondary"
                : "text-primary-800"
              : valueTone
          )}
        >
          {shown}
        </span>
        {chevron}
      </>
    );
  }

  // Written out per variant and per state rather than layered as overrides:
  // cn() is plain clsx here, so two conflicting utilities would be decided by
  // stylesheet order, not by which was written last.
  // Three states: open, holding a real choice (white, navy edge, so an
  // active filter stands out in the rail), and resting on "Any …".
  const bordered = open
    ? "border-primary-700 bg-neutral-000 ring-2 ring-primary-700/15"
    : isPlaceholder
      ? "border-primary-100/80 bg-primary-050/50 hover:border-primary-300"
      : "border-primary-300 bg-neutral-000 hover:border-primary-700";
  const triggerClass = {
    well: cn("min-h-[58px] gap-3 rounded-md border pl-4 pr-3.5", bordered),
    compact: cn("h-11 gap-2 rounded-md border px-3 font-sans text-[14px] leading-[20px]", bordered),
    field: cn(
      "min-h-[48px] gap-2.5 rounded-sm border bg-neutral-000 px-4 font-sans text-[16px] leading-[24px]",
      open ? "border-primary-700 ring-2 ring-primary-700" : "border-neutral-300 hover:border-primary-300"
    ),
    toolbar: cn(
      "h-12 gap-2 rounded-lg bg-neutral-000 px-4 font-sans text-[14px] leading-[20px] shadow-e1",
      open ? "ring-2 ring-primary-700/30" : "ring-1 ring-primary-900/[0.06] hover:ring-primary-200"
    ),
  }[variant];

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel ? `${ariaLabel}: ${shown}` : undefined}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onTriggerKey}
        className={cn(
          "flex w-full cursor-pointer items-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40 disabled:cursor-wait disabled:opacity-60",
          triggerClass,
          className
        )}
      >
        {body}
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={menuRef}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: pos.up ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: pos.up ? 4 : -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "fixed",
                  left: pos.left,
                  width: pos.width,
                  top: pos.top,
                  bottom: pos.bottom,
                  transformOrigin: pos.up ? "bottom center" : "top center",
                }}
                className="z-popover flex flex-col overflow-hidden rounded-md bg-neutral-000 shadow-e3 ring-1 ring-primary-900/10"
                onKeyDown={onMenuKey}
              >
                {searchable && (
                  <div className="relative border-b border-neutral-200 p-2">
                    <Search
                      className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                      aria-hidden="true"
                    />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                      }}
                      role="combobox"
                      aria-expanded="true"
                      aria-controls={listId}
                      aria-activedescendant={visible[active] ? `${uid}-opt-${active}` : undefined}
                      aria-label={`Search ${ariaLabel ?? label ?? "options"}`}
                      placeholder="Type to search…"
                      className="h-10 w-full rounded-sm bg-neutral-050 pl-9 pr-3 font-sans text-[14px] text-text-primary placeholder:text-text-secondary focus:bg-neutral-000 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
                    />
                  </div>
                )}
                <ul
                  ref={listRef}
                  id={listId}
                  role="listbox"
                  tabIndex={-1}
                  aria-label={ariaLabel ?? label}
                  aria-activedescendant={visible[active] ? `${uid}-opt-${active}` : undefined}
                  style={{ maxHeight: pos.maxHeight - (searchable ? 57 : 0) }}
                  className="overflow-y-auto overscroll-contain py-1.5 focus:outline-none"
                >
                  {visible.length === 0 && (
                    <li className="px-4 py-6 text-center t-body-sm text-text-secondary">
                      Nothing matches “{query}”
                    </li>
                  )}
                  {visible.map((option, i) => {
                    const isSel = option.value === value;
                    return (
                      <li
                        key={option.value || "__any"}
                        id={`${uid}-opt-${i}`}
                        data-index={i}
                        role="option"
                        aria-selected={isSel}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => commit(option)}
                        onMouseMove={() => active !== i && setActive(i)}
                        className={cn(
                          "mx-1.5 flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 transition-colors duration-100",
                          i === active ? "bg-primary-050" : "bg-transparent"
                        )}
                      >
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate font-sans text-[14px] leading-[20px]",
                            isSel
                              ? "font-bold text-primary-800"
                              : option.muted || option.value === emptyValue
                                ? "text-text-secondary"
                                : "text-text-primary"
                          )}
                        >
                          {option.label}
                        </span>
                        {option.hint && (
                          <span
                            className={cn(
                              "shrink-0 t-caption",
                              option.muted ? "text-text-secondary" : "text-primary-700"
                            )}
                          >
                            {option.hint}
                          </span>
                        )}
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0 text-accent-500",
                            isSel ? "opacity-100" : "opacity-0"
                          )}
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
