"use client";

import { useEffect, useRef } from "react";
import { AD_CONFIG } from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   AD SCRIPTS PROVIDER
   Injects third-party ad network scripts globally.
   This component renders nothing visible — it only manages
   script injection for Adsterra and HilltopAds.

   PLACED IN: layout.tsx as a child of <body>
   ════════════════════════════════════════════════════════════════ */

function injectScript(url: string, async = true, id?: string): void {
  if (!url) return;
  if (id && document.getElementById(id)) return; // Already loaded
  if (!id && document.querySelector(`script[src="${url}"]`)) return;

  const script = document.createElement("script");
  script.src = url;
  script.async = async;
  if (id) script.id = id;
  script.onload = () => {
    // Script loaded successfully
  };
  script.onerror = () => {
    // Ad script failed — don't block the page
    console.warn(`[AdScripts] Failed to load: ${url}`);
  };
  document.head.appendChild(script);
}

export function AdScriptsProvider() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Inject Adsterra popunder script
    // This script typically auto-binds to user clicks and opens
    // a popunder window on the first interaction.
    injectScript(
      AD_CONFIG.adsterra.popunderScriptUrl,
      true,
      "adsterra-popunder-script"
    );

    // HilltopAds push notification script
    // This handles push notification permission requests.
    // The actual trigger is controlled by the useAdMonetization hook
    // which loads it after scroll interaction. We do NOT load it here
    // to avoid blocking the initial page load.
    // It will be lazy-loaded by the scroll handler.

  }, []);

  // This component renders nothing
  return null;
}
