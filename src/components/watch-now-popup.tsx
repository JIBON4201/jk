"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  AlertTriangle,
  Play,
  Clock,
  ExternalLink,
  Loader2,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ════════════════════════════════════════════════════════════════
   WATCH NOW POPUP
   Multi-step flow: Age Gate → Ad Interstitial (5s countdown) → Continue CTA
   
   Props:
   - open: boolean to show/hide popup
   - onClose: callback when popup is dismissed
   - redirectUrl: external URL to redirect to after CTA click
   
   Ad Network Integration:
   Replace the placeholder <div className="popup-ad-slot"> elements
   with your real ad network code (PropellerAds, TrafficStars, Exoclick, etc.)
   ════════════════════════════════════════════════════════════════ */

interface WatchNowPopupProps {
  open: boolean;
  onClose: () => void;
  redirectUrl: string;
}

const COUNTDOWN_SECONDS = 5;

export function WatchNowPopup({ open, onClose, redirectUrl }: WatchNowPopupProps) {
  const [proceeded, setProceeded] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [phase, setPhase] = useState<"loading" | "ads" | "ready">("loading");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // NOTE: State is reset via `key` prop in parent component (page.tsx)
  // Each time the popup opens, it receives a new key and remounts with fresh state.

  // Countdown timer after proceeding past age gate
  useEffect(() => {
    if (!proceeded) return;

    // Loading phase — simulate ad loading
    const loadingTimeout = setTimeout(() => {
      setPhase("ads");
    }, 800);

    return () => clearTimeout(loadingTimeout);
  }, [proceeded]);

  useEffect(() => {
    if (phase !== "ads") return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleProceed = useCallback(() => {
    setProceeded(true);
  }, []);

  const handleContinue = useCallback(() => {
    window.open(redirectUrl, "_blank", "noopener,noreferrer");
    onClose();
  }, [redirectUrl, onClose]);

  const handleClose = useCallback(() => {
    if (!proceeded) return; // Cannot close during age gate
    onClose();
  }, [proceeded, onClose]);

  // ESC key to close (only after age gate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && proceeded) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [proceeded, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Full-screen backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
            onClick={proceeded ? handleClose : undefined}
            aria-hidden="true"
          />

          {/* ── Popup container ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Access verification"
          >
            <AnimatePresence mode="wait">
              {!proceeded ? (
                /* ════════════════════════════════════════════════════
                   STEP 1: AGE VERIFICATION GATE
                   ════════════════════════════════════════════════════ */
                <motion.div
                  key="age-gate"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card relative w-full max-w-md rounded-2xl border border-white/10 p-8 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Warning icon */}
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-violet-500/20">
                    <AlertTriangle className="h-8 w-8 text-rose-400" aria-hidden="true" />
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    Age Verification Required
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    This platform contains <strong className="text-foreground/80">adult content</strong> that is
                    intended for individuals aged 18 and above. By proceeding, you confirm
                    that you are of legal age in your jurisdiction to view such content.
                  </p>

                  {/* Trust indicators */}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground">
                      <Shield className="h-3 w-3 text-rose-400" aria-hidden="true" />
                      AES-256 Encrypted
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3 text-rose-400" aria-hidden="true" />
                      Zero Logging
                    </div>
                  </div>

                  {/* Proceed button */}
                  <Button
                    onClick={handleProceed}
                    size="lg"
                    className="mt-6 animate-glow w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-6 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
                  >
                    I Am 18+ — Enter Now
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>

                  <p className="mt-4 text-[11px] text-muted-foreground/60">
                    By entering, you agree to our Terms of Service and confirm you are
                    at least 18 years old.
                  </p>
                </motion.div>
              ) : (
                /* ════════════════════════════════════════════════════
                   STEP 2: AD INTERSTITIAL
                   ════════════════════════════════════════════════════ */
                <motion.div
                  key="ad-interstitial"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header bar */}
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-rose-400" aria-hidden="true" />
                      <span className="text-sm font-semibold">
                        VaultStream
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Countdown / status */}
                      {phase === "loading" && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                          Loading...
                        </div>
                      )}
                      {phase === "ads" && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 text-rose-400" aria-hidden="true" />
                          Please wait {countdown}s...
                        </div>
                      )}
                      {phase === "ready" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <Shield className="h-3 w-3" aria-hidden="true" />
                          Ready
                        </div>
                      )}

                      {/* Close button (only after proceeding) */}
                      <button
                        onClick={handleClose}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                        aria-label="Close popup"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-0.5 w-full bg-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-violet-500"
                      initial={{ width: "0%" }}
                      animate={{
                        width: phase === "ready" ? "100%" : `${((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100}%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  {/* Ad content area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      {/* ── Ad Slot 1: Top Leaderboard ── */}
                      <PopupAdSlot
                        label="728×90 Leaderboard — Popup Top"
                        slot="popup-top-728x90"
                        width="100%"
                        height="90px"
                        visible={phase !== "loading"}
                      />

                      {/* ── Ad Slot 2 & 3: Side-by-side rectangles ── */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <PopupAdSlot
                          label="300×250 Rectangle — Popup Left"
                          slot="popup-left-300x250"
                          width="100%"
                          height="250px"
                          visible={phase !== "loading"}
                        />
                        <PopupAdSlot
                          label="300×250 Rectangle — Popup Right"
                          slot="popup-right-300x250"
                          width="100%"
                          height="250px"
                          visible={phase !== "loading"}
                        />
                      </div>

                      {/* ── Ad Slot 4: Native in-content ── */}
                      <PopupAdSlot
                        label="Native Ad — Popup Mid"
                        slot="popup-mid-native"
                        width="100%"
                        height="120px"
                        visible={phase !== "loading"}
                      />

                      {/* ── Ad Slot 5: Bottom Leaderboard ── */}
                      <PopupAdSlot
                        label="728×90 Leaderboard — Popup Bottom"
                        slot="popup-bottom-728x90"
                        width="100%"
                        height="90px"
                        visible={phase !== "loading"}
                      />
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="border-t border-white/5 px-4 py-4 sm:px-6">
                    {phase === "ready" ? (
                      <Button
                        onClick={handleContinue}
                        size="lg"
                        className="animate-glow w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-6 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
                      >
                        <Play className="mr-2 h-5 w-5 fill-white" aria-hidden="true" />
                        Continue Watching
                        <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        className="w-full rounded-xl bg-white/5 text-muted-foreground cursor-not-allowed"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Preparing your content...
                      </Button>
                    )}

                    <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
                      Content will open in a new tab. Your connection remains encrypted.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════
   POPUP AD SLOT
   Placeholder ad slot for the interstitial popup.
   Replace inner content with real ad network code.
   ════════════════════════════════════════════════════════════════ */

function PopupAdSlot({
  label,
  slot,
  width,
  height,
  visible,
}: {
  label: string;
  slot: string;
  width: string;
  height: string;
  visible: boolean;
}) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use a callback pattern — only setState in async callbacks, never synchronously
  useEffect(() => {
    if (visible) {
      timeoutRef.current = setTimeout(() => setShow(true), 200);
    } else {
      // Use a microtask to avoid synchronous setState warning
      timeoutRef.current = setTimeout(() => setShow(false), 0);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  if (!show) {
    return (
      <div
        className="rounded-lg bg-white/[0.03] border border-white/5"
        style={{ width, height: height === "100%" ? undefined : height, minHeight: height }}
        data-ad-slot={slot}
        aria-label="Advertisement"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/20" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="popup-ad-slot rounded-lg bg-white/[0.03] border border-white/5 overflow-hidden"
      style={{ width, minHeight: height }}
      data-ad-slot={slot}
      aria-label="Advertisement"
      role="complementary"
    >
      {/*
        ╔═══════════════════════════════════════════════════════╗
        ║  REPLACE THIS CONTENT WITH YOUR REAL AD CODE          ║
        ║                                                       ║
        ║  Example — PropellerAds / TrafficStars / Exoclick:    ║
        ║  <script src="//ad-network.com/tag.js" />             ║
        ║                                                       ║
        ║  Example — Popunder:                                  ║
        ║  <script src="//ad-network.com/popunder.js" />        ║
        ║                                                       ║
        ║  Example — Native ad:                                 ║
        ║  <div id="{slot}" />                                  ║
        ║  <script>                                             ║
        ║    adNetwork.render({{ id: "{slot}", type: "native" }})║
        ║  </script>                                            ║
        ╚═══════════════════════════════════════════════════════╝
      */}
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/10">
            <svg
              className="h-5 w-5 text-muted-foreground/25"
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
          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/30">
            {label}
          </span>
          <span className="block mt-0.5 text-[10px] text-muted-foreground/20">
            Slot: {slot}
          </span>
        </div>
      </div>
    </div>
  );
}


