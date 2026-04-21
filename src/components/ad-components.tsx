"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   AD SLOT COMPONENT
   A reusable ad placeholder that you can replace with real
   ad network code (Google AdSense, PropellerAds, EroAdvertising,
   Exoclick, JuicyAds, TrafficStars, etc.)
   ════════════════════════════════════════════════════════════════ */

interface AdSlotProps {
  /** Unique identifier for this ad placement */
  id: string;
  /** Ad slot name for ad network targeting */
  slot?: string;
  /** Display size preset */
  size?: "leaderboard" | "banner" | "rectangle" | "skyscraper" | "mobile-banner" | "native" | "fluid";
  /** Custom class name */
  className?: string;
  /** Label shown in demo mode */
  label?: string;
  /** Whether to show a close/dismiss button */
  dismissible?: boolean;
  /** Sticky positioning */
  sticky?: "bottom" | "top" | false;
}

const sizeMap: Record<string, { w: string; h: string; label: string }> = {
  leaderboard: { w: "728px", h: "90px", label: "728×90 Leaderboard" },
  banner: { w: "468px", h: "60px", label: "468×60 Banner" },
  rectangle: { w: "300px", h: "250px", label: "300×250 Rectangle" },
  skyscraper: { w: "160px", h: "600px", label: "160×600 Skyscraper"  },
  "mobile-banner": { w: "320px", h: "50px", label: "320×50 Mobile Banner" },
  native: { w: "100%", h: "120px", label: "Native Ad" },
  fluid: { w: "100%", h: "auto", label: "Fluid Ad" },
};

export function AdSlot({
  id,
  slot,
  size = "rectangle",
  className,
  label,
  dismissible = false,
  sticky = false,
}: AdSlotProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const dim = sizeMap[size] || sizeMap.rectangle;

  // Lazy-load: only show ad when it enters viewport
  useEffect(() => {
    const el = document.getElementById(`ad-slot-${id}`);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  if (dismissed) return null;

  return (
    <div
      id={`ad-slot-${id}`}
      className={cn(
        "ad-slot relative mx-auto flex items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/[0.03]",
        sticky === "bottom" && "fixed bottom-0 left-0 right-0 z-40 rounded-none border-x-0 border-b-0",
        sticky === "top" && "fixed top-16 left-0 right-0 z-40 rounded-none border-x-0",
        size === "leaderboard" && "max-w-[728px]",
        size === "banner" && "max-w-[468px]",
        size === "rectangle" && "max-w-[300px]",
        size === "skyscraper" && "max-w-[160px]",
        size === "mobile-banner" && "max-w-[320px]",
        size === "native" && "w-full",
        size === "fluid" && "w-full",
        sticky === "bottom" && "w-full",
        className
      )}
      style={!sticky ? { minHeight: dim.h, maxWidth: dim.w } : undefined}
      data-ad-slot={slot || id}
      data-ad-size={size}
      aria-label="Advertisement"
      role="complementary"
    >
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white/60 hover:bg-black/60 hover:text-white transition-colors"
          aria-label="Dismiss advertisement"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {visible && (
        <div className="flex flex-col items-center gap-1 p-3 text-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">
            {label || dim.label}
          </span>
          <span className="text-[10px] text-muted-foreground/30">
            Ad Slot: {id}
          </span>

          {/*
            ╔═══════════════════════════════════════════════════════╗
            ║  REPLACE THE CONTENT BELOW WITH YOUR REAL AD CODE   ║
            ║                                                     ║
            ║  Example — Google AdSense:                         ║
            ║  <ins className="adsbygoogle"                       ║
            ║    style={{ display: "block" }}                     ║
            ║    data-ad-client="ca-pub-XXXXXXXXXX"              ║
            ║    data-ad-slot="XXXXXXXXXX"                       ║
            ║    data-ad-format="auto"                           ║
            ║    data-full-width-responsive="true"              ║
            ║  />                                                 ║
            ║                                                     ║
            ║  Example — PropellerAds / TrafficStars:            ║
            ║  <div id="{id}">                                    ║
            ║    <script src="//ad-network-url.com/tag.js" />    ║
            ║  </div>                                             ║
            ╚═══════════════════════════════════════════════════════╝
          */}
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-white/10 text-muted-foreground/30">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-6v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 6v-4.5m0 4.5h-4.5m4.5 0L15 15"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   AD BANNER — Full-width horizontal ad between sections
   ════════════════════════════════════════════════════════════════ */
export function AdBanner({
  id,
  slot,
  className,
  label,
  dismissible = false,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
  dismissible?: boolean;
}) {
  return (
    <div className={cn("py-6 sm:py-8", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="leaderboard"
        className={className}
        label={label}
        dismissible={dismissible}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   IN-CONTENT AD — Native-style ad within article content
   ════════════════════════════════════════════════════════════════ */
export function InContentAd({
  id,
  slot,
  className,
  label,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("my-8 sm:my-10", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="native"
        className={cn("w-full", className)}
        label={label || "In-Content Ad"}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR AD — Rectangle ad for side placement
   ════════════════════════════════════════════════════════════════ */
export function SidebarAd({
  id,
  slot,
  className,
  label,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="rectangle"
        className={className}
        label={label || "300×250 Sidebar Ad"}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STICKY MOBILE BOTTOM AD BAR
   Shows on mobile, dismissible, with "Watch Now" CTA above it
   ════════════════════════════════════════════════════════════════ */
export function MobileStickyAd({
  id,
  slot,
  className,
}: {
  id: string;
  slot?: string;
  className?: string;
}) {
  return (
    <div className={cn("md:hidden", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="mobile-banner"
        label="320×50 Mobile Sticky Ad"
        dismissible
        sticky="bottom"
        className="mb-[env(safe-area-inset-bottom)]"
      />
    </div>
  );
}
