"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  AD_CONFIG,
  checkDailyCap,
  incrementDailyCap,
} from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   AD MONETIZATION HOOK
   Manages the entire click funnel and ad trigger system.

   FUNNEL FLOW:
   ┌─────────────────────────────────────────────────────────┐
   │ 1. First click ANYWHERE on page                         │
   │    → Trigger Adsterra popunder (once per 24h)           │
   │                                                         │
   │ 2. Click on CTA button (Watch / Play / Access / etc.)   │
   │    → Open popup with loading + ads                     │
   │    → On "Continue" click → redirect to smartlink        │
   │                                                         │
   │ 3. User scrolls down 30%+ of page                       │
   │    → Trigger HilltopAds push notification (once/session)│
   └─────────────────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════════════ */

const KEYS = AD_CONFIG.storageKeys;

/**
 * Load an external script dynamically and return a promise.
 * Uses a dedup map to prevent double-loading the same URL.
 */
function loadScriptOnce(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(); // no URL configured — silently skip
      return;
    }
    // Check if already loaded
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Don't block on ad script errors
    document.head.appendChild(script);
  });
}

export function useAdMonetization() {
  const popunderTriggered = useRef(false);
  const pushTriggered = useRef(false);
  const initialized = useRef(false);

  /* ── ADSTERRA POPUNDER: Load script on mount ── */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Pre-load the Adsterra popunder script (non-blocking)
    loadScriptOnce(AD_CONFIG.adsterra.popunderScriptUrl);
  }, []);

  /* ── FIRST CLICK HANDLER: Trigger popunder ── */
  useEffect(() => {
    const handleFirstClick = () => {
      // Check if already done this session
      if (sessionStorage.getItem(KEYS.firstClickDone)) return;

      // Check daily cap
      if (!checkDailyCap(KEYS.popunderCountToday, AD_CONFIG.adsterra.dailyCap)) {
        return;
      }

      // Mark as done
      popunderTriggered.current = true;
      sessionStorage.setItem(KEYS.firstClickDone, "1");
      incrementDailyCap(KEYS.popunderCountToday);

      // If popunder script URL is set, it's already loaded above
      // Adsterra popunder scripts auto-bind to clicks — our script
      // pre-loading handles the trigger. If manual trigger needed:
      // The script typically binds itself to the next user click.
    };

    document.addEventListener("click", handleFirstClick, { once: true });
    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  /* ── SCROLL HANDLER: Trigger push notification ── */
  useEffect(() => {
    if (pushTriggered.current) return;
    if (sessionStorage.getItem(KEYS.pushRequested)) return;

    const handleScroll = () => {
      if (pushTriggered.current) return;

      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercent >= AD_CONFIG.behavior.pushScrollThreshold) {
        pushTriggered.current = true;
        sessionStorage.setItem(KEYS.pushRequested, "1");

        // Load push notification script after scroll threshold
        setTimeout(() => {
          loadScriptOnce(AD_CONFIG.hilltopAds.pushScriptUrl);
        }, AD_CONFIG.behavior.pushScrollDelay);
      }
    };

    // Use passive listener for scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── CTA CLICK HANDLER: Smartlink redirect with loading effect ── */
  const triggerSmartlinkRedirect = useCallback(() => {
    const url = AD_CONFIG.adsterra.smartlinkUrl;
    if (!url) return false;

    // Open smartlink in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }, []);

  return {
    /** Call this when user clicks a CTA button. Opens smartlink in new tab. */
    triggerSmartlinkRedirect,
  };
}
