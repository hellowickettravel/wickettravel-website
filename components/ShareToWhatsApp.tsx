"use client";

import { useId, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { whatsappShareHref } from "@/lib/parentsShare";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

/**
 * "Share to your WhatsApp groups". Used on the form's success screen and on
 * every listing page, so a post can travel wherever the families already are.
 *
 * The message is an editable textarea, not a fixed string: we can't know
 * whether "my parent" is a mum, a dad or both, and people want to write to
 * their own groups in their own words. Every button sends whatever is in the
 * box right now.
 *
 * WhatsApp opens through `wa.me/?text=`, which works on phones (the app) and
 * desktops (WhatsApp Web or the desktop app) with no API key. Copying is the
 * fallback for everything else: a group on another app, or a phone with no
 * WhatsApp installed.
 */

type Copied = "message" | "link" | null;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and non-secure contexts: fall back to a hidden textarea.
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function ShareToWhatsApp({
  initialMessage,
  url,
  title = "Share your request in your WhatsApp groups",
  lead = "Most help is found through people who already know someone on the same flight. Send this to your family and community groups. The link opens your request on our site, and anyone who can help sends their details straight to our team.",
  className,
}: {
  initialMessage: string;
  url: string;
  title?: string;
  lead?: string;
  className?: string;
}) {
  const uid = useId();
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState<Copied>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async (what: Exclude<Copied, null>) => {
    const ok = await copyText(what === "message" ? message : url);
    setCopyFailed(!ok);
    setCopied(ok ? what : null);
    if (ok) window.setTimeout(() => setCopied((c) => (c === what ? null : c)), 2500);
  };

  return (
    <div
      className={cn(
        "rounded-md border border-neutral-300 bg-neutral-000 p-5 text-left shadow-e1 sm:p-6",
        className
      )}
    >
      <p className="flex items-center gap-2 t-label-1 text-primary-800">
        <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#075E54]" />
        {title}
      </p>
      <p className="mt-1.5 t-body-sm text-text-secondary">{lead}</p>

      <label htmlFor={`${uid}-message`} className="mt-4 block t-label-2 text-primary-800">
        Your message <span className="font-normal text-text-secondary">(you can edit it)</span>
      </label>
      <textarea
        id={`${uid}-message`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={9}
        className="input mt-2 min-h-[12rem] resize-y py-3 text-[14px] leading-[22px]"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={whatsappShareHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          // White on WhatsApp's dark teal is 7.6:1. The brand's bright green
          // is 2:1 behind white text, too faint for a button label.
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#075E54] px-5 py-3 font-sans text-[15px] font-bold leading-[20px] text-neutral-000 shadow-e1 transition-colors hover:bg-[#054A42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E54] focus-visible:ring-offset-2"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Share on WhatsApp
        </a>
        <button type="button" onClick={() => copy("message")} className="btn btn-outline">
          {copied === "message" ? (
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied === "message" ? "Message copied" : "Copy message"}
        </button>
        <button type="button" onClick={() => copy("link")} className="btn btn-outline">
          {copied === "link" ? (
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {copied === "link" ? "Link copied" : "Copy link only"}
        </button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {copied === "message" ? "Message copied to clipboard" : copied === "link" ? "Link copied to clipboard" : ""}
      </p>
      {copyFailed && (
        <p className="mt-3 t-caption text-error">
          Your browser blocked copying. Select the text above and copy it by hand.
        </p>
      )}

      <p className="mt-4 t-caption text-text-secondary">
        The link shows your route, date and airline only. Never your name, phone
        number or email.
      </p>
    </div>
  );
}
