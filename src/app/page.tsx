"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Shield,
  Zap,
  Eye,
  Play,
  Lock,
  Globe,
  MonitorSmartphone,
  ChevronRight,
  Users,
  Clock,
  Star,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Wifi,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdBanner, InContentAd, MobileStickyAd } from "@/components/ad-components";
import { WatchNowPopup } from "@/components/watch-now-popup";
import { AiGallerySection } from "@/components/ai-gallery-section";
import { useAdMonetization } from "@/hooks/use-ad-monetization";

// Ad network smartlink URL is now configured in src/lib/ad-config.ts
const SITE_NAME = "VaultStream";
const SITE_URL = "https://vaultstream.com";

/* ════════════════════════════════════════════════════════════════
   ANIMATION HELPERS
   ════════════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ════════════════════════════════════════════════════════════════
   JSON-LD STRUCTURED DATA
   ════════════════════════════════════════════════════════════════ */
function JsonLd() {
  // Organization + WebSite schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1152,
          height: 864,
        },
        description:
          "VaultStream is the leading private video streaming platform offering instant, secure, no-signup access to 50,000+ exclusive premium videos in HD and 4K.",
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: "English",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${SITE_NAME} — Private Video Platform`,
        description:
          "Stream exclusive private HD & 4K videos instantly — no signup, no credit card. Secure encrypted streaming with zero tracking.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Private Video Platform (2026) – Instant Access | VaultStream",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        description:
          "Stream 50,000+ exclusive private videos in HD & 4K. No signup required. End-to-end encrypted, zero tracking. The #1 private video platform trusted by 2.4M+ viewers.",
      },
      {
        "@type": "VideoPlatform",
        "@id": `${SITE_URL}/#platform`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Private video streaming platform with no signup, encryption, and instant HD/4K access.",
        genre: "Private Video Content",
        inLanguage: "en-US",
        numberOfVideos: 50000,
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: "18",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
      },
    ],
  };

  // FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is VaultStream really free with no signup required?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. VaultStream provides completely free access to its entire library with no signup, no hidden fees, no trial periods, and no account creation required. Simply click \"Watch Now\" and start streaming immediately. We never ask for your email, credit card, or any personal information.",
        },
      },
      {
        "@type": "Question",
        name: "How does VaultStream protect my privacy and data?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VaultStream uses AES-256 end-to-end encryption on all video streams — the same standard used by banks and government agencies. We never store browsing history, don't require personal information, and operate under a strict zero-logging policy. All connections are routed through TLS 1.3 tunnels. We don't use cookies for tracking, don't fingerprint devices, and don't share data with third parties.",
        },
      },
      {
        "@type": "Question",
        name: "What video quality options are available on VaultStream?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VaultStream supports resolutions from 480p up to 4K Ultra HD with HDR (High Dynamic Range). Our adaptive bitrate streaming technology automatically adjusts video quality based on your internet speed — ensuring smooth, buffer-free playback whether you're on fiber, 5G, 4G LTE, or a standard broadband connection.",
        },
      },
      {
        "@type": "Question",
        name: "Can I watch VaultStream on my mobile phone or tablet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. VaultStream is fully responsive and works flawlessly on all modern devices — including iPhone, iPad, Android phones and tablets, Windows PCs, MacBooks, and Smart TVs. The experience is optimized for every screen size with adaptive layouts and touch-friendly controls.",
        },
      },
      {
        "@type": "Question",
        name: "What types of content are available on VaultStream?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VaultStream's library spans a wide range of exclusive private video content across multiple categories. We curate over 50,000 premium videos, with new content added daily. Every piece of content undergoes quality review before being published, ensuring professional, high-production-value material. Our AI-powered recommendation engine helps you discover videos tailored to your preferences — without storing any personal viewing data.",
        },
      },
      {
        "@type": "Question",
        name: "Does VaultStream work with VPN or in restricted regions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. VaultStream is accessible worldwide across 190+ countries and works seamlessly with VPN services. Our global CDN (Content Delivery Network) with 200+ edge locations ensures fast streaming regardless of your geographic location. We don't block VPN traffic and our platform is designed to work with or without a VPN connection.",
        },
      },
      {
        "@type": "Question",
        name: "How often is new content added to VaultStream?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New exclusive content is added daily to VaultStream's library. Our content team reviews and curates submissions around the clock to maintain the highest quality standards. With 50,000+ videos already available and hundreds added each week, there's always something new to discover. You can browse trending content, new releases, or use our smart filters to find exactly what you're looking for.",
        },
      },
    ],
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Private Video Platform",
        item: SITE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */
const features = [
  {
    icon: Lock,
    title: "AES-256 Encryption",
    desc: "Bank-grade end-to-end encryption on every stream. Your viewing activity remains completely private and secure at all times.",
  },
  {
    icon: Zap,
    title: "Instant 4K Streaming",
    desc: "Zero buffering with adaptive bitrate technology. Crystal-clear 1080p and 4K Ultra HD video delivered through 200+ global CDN edge locations.",
  },
  {
    icon: Eye,
    title: "Zero Signup Required",
    desc: "No accounts, no emails, no personal data. One-click access to the entire library — visit, watch, and leave without any digital trace.",
  },
  {
    icon: Globe,
    title: "190+ Countries",
    desc: "Stream from anywhere on Earth. VPN-friendly infrastructure with global edge servers ensures fast, reliable access in every region.",
  },
  {
    icon: Shield,
    title: "Zero-Logging Policy",
    desc: "No IP logging, no browsing history, no device fingerprinting. Built from the ground up with anonymity as the core architectural principle.",
  },
  {
    icon: MonitorSmartphone,
    title: "All Devices Supported",
    desc: "Optimized for iOS, Android, Windows, macOS, and Smart TVs. Responsive design with touch-friendly controls adapts to any screen size.",
  },
];

const steps = [
  {
    num: "01",
    title: 'Click "Watch Now"',
    desc: "No registration forms, no email verification, no payment gateways. A single click gives you instant access to 50,000+ exclusive private videos.",
  },
  {
    num: "02",
    title: "Browse & Discover",
    desc: "Explore curated categories, trending content, and new releases. Smart filters and AI-powered recommendations surface videos you'll love instantly.",
  },
  {
    num: "03",
    title: "Stream in HD or 4K",
    desc: "Adaptive streaming delivers the perfect resolution for your connection — from 480p on mobile networks to 4K HDR on fiber. Hit play and enjoy.",
  },
];

const faqs = [
  {
    q: "Is VaultStream really free with no signup required?",
    a: "Yes. VaultStream provides completely free access to its entire library with no signup, no hidden fees, no trial periods, and no account creation required. Simply click \"Watch Now\" and start streaming immediately. We never ask for your email, credit card, or any personal information.",
  },
  {
    q: "How does VaultStream protect my privacy and data?",
    a: "VaultStream uses AES-256 end-to-end encryption on all video streams — the same standard used by banks and government agencies. We never store browsing history, don't require personal information, and operate under a strict zero-logging policy. All connections are routed through TLS 1.3 tunnels. We don't use cookies for tracking, don't fingerprint devices, and don't share data with third parties.",
  },
  {
    q: "What video quality options are available on VaultStream?",
    a: "VaultStream supports resolutions from 480p up to 4K Ultra HD with HDR (High Dynamic Range). Our adaptive bitrate streaming technology automatically adjusts video quality based on your internet speed — ensuring smooth, buffer-free playback whether you're on fiber, 5G, 4G LTE, or a standard broadband connection.",
  },
  {
    q: "Can I watch VaultStream on my mobile phone or tablet?",
    a: "Absolutely. VaultStream is fully responsive and works flawlessly on all modern devices — including iPhone, iPad, Android phones and tablets, Windows PCs, MacBooks, and Smart TVs. The experience is optimized for every screen size with adaptive layouts and touch-friendly controls.",
  },
  {
    q: "What types of content are available on VaultStream?",
    a: "VaultStream's library spans a wide range of exclusive private video content across multiple categories. We curate over 50,000 premium videos, with new content added daily. Every piece of content undergoes quality review before being published, ensuring professional, high-production-value material. Our AI-powered recommendation engine helps you discover videos tailored to your preferences — without storing any personal viewing data.",
  },
  {
    q: "Does VaultStream work with VPN or in restricted regions?",
    a: "Yes. VaultStream is accessible worldwide across 190+ countries and works seamlessly with VPN services. Our global CDN (Content Delivery Network) with 200+ edge locations ensures fast streaming regardless of your geographic location. We don't block VPN traffic and our platform is designed to work with or without a VPN connection.",
  },
  {
    q: "How often is new content added to VaultStream?",
    a: "New exclusive content is added daily to VaultStream's library. Our content team reviews and curates submissions around the clock to maintain the highest quality standards. With 50,000+ videos already available and hundreds added each week, there's always something new to discover. You can browse trending content, new releases, or use our smart filters to find exactly what you're looking for.",
  },
];

const trustBadges = [
  { icon: Lock, text: "AES-256 Encrypted" },
  { icon: Shield, text: "Zero Logging" },
  { icon: Eye, text: "No Tracking" },
  { icon: Wifi, text: "VPN Friendly" },
  { icon: Cpu, text: "Adaptive 4K" },
  { icon: Globe, text: "Global CDN" },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupKey, setPopupKey] = useState(0);

  // Initialize ad monetization (popunder on first click, push on scroll)
  const { triggerSmartlinkRedirect, triggerPopunder } = useAdMonetization();

  const openPopup = useCallback(() => {
    setPopupKey((k) => k + 1);
    setPopupOpen(true);
  }, []);
  const closePopup = useCallback(() => setPopupOpen(false), []);

  // Content click inside popup → popunder (1st only) + smartlink redirect
  const handlePopupContentClick = useCallback(
    (_contentId: string) => {
      // Fire popunder on first content click
      triggerPopunder();
      // Then open smartlink
      setTimeout(() => {
        triggerSmartlinkRedirect();
      }, 300);
    },
    [triggerPopunder, triggerSmartlinkRedirect]
  );

  return (
    <>
    {/* ── Watch Now Popup ── */}
    <WatchNowPopup key={popupKey} open={popupOpen} onClose={closePopup} onContentClick={handlePopupContentClick} />
    <div className="noise-overlay relative min-h-screen overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <JsonLd />

      {/* ─── Ambient background blobs ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-rose-600/8 blur-[100px]" />
      </div>

      {/* ═════════════════ NAVBAR ═══════════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card sticky top-0 z-50 border-b border-white/5"
        role="navigation"
        aria-label="Main navigation"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5" aria-label="VaultStream Home" itemProp="url">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-violet-500">
              <Play className="h-4 w-4 fill-white text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight" itemProp="name">
              Vault<span className="text-gradient">Stream</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" itemProp="url">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" itemProp="url">
              How It Works
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors" itemProp="url">
              FAQ
            </a>
          </div>

          <Button
            onClick={openPopup}
            itemProp="url"
            className="bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-lg hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
          >
            Watch Now
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </motion.nav>

      {/* ── AD: Top Bar (immediately below navbar, before everything) ── */}
      <div className="relative z-40">
        <AdBanner id="top-bar" slot="top-bar-728x90" label="728×90 Leaderboard — Top Bar" dismissible />
      </div>

      <main className="relative z-10" role="main">
        {/* ═══════════════ HERO ═══════════════ */}
        <section
          className="relative"
          aria-labelledby="hero-heading"
          id="hero"
        >
          <div className="absolute inset-0 -z-[1]" aria-hidden="true">
            <Image
              src="/hero-bg.png"
              alt="VaultStream cinematic platform background showing premium video streaming interface"
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge
                  variant="outline"
                  className="mb-6 border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-rose-400 text-sm"
                >
                  <Lock className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  18+ Only — Private &amp; Secure
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                id="hero-heading"
                className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl"
              >
                AI Generated{" "}
                <span className="text-gradient">Visual Preview</span> Gallery
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
              >
                This site delivers free sex movies and fast free pron videos (tube porn). Now 10 milllion sex vids available for free
                ! Featuring hot pussy,sexy girls and more........
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                  <Button
                    onClick={() => {
                      const gallery = document.getElementById('ai-gallery');
                      if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
                    }}
                    size="lg"
                    className="animate-glow h-13 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-8 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
                  >
                    <Eye className="mr-2 h-5 w-5" aria-hidden="true" />
                    Explore Content
                    <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    onClick={openPopup}
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-xl border-white/15 bg-white/[0.03] px-6 text-base font-medium text-muted-foreground hover:border-rose-500/40 hover:text-rose-400 transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" aria-hidden="true" />
                    Watch Now
                  </Button>
                <p className="text-xs text-muted-foreground">
                  No signup &bull; No credit card &bull; Instant access &bull; Zero tracking
                </p>
              </motion.div>

              {/* Trust badges row */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                aria-label="Trust and security badges"
              >
                {trustBadges.map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground sm:text-xs"
                  >
                    <b.icon className="h-3 w-3 text-rose-400" aria-hidden="true" />
                    {b.text}
                  </div>
                ))}
              </motion.div>

              {/* ── AD: Hero Bottom (after trust badges) ── */}
              <div className="mt-10">
                <AdBanner id="hero-bottom" slot="hero-bottom-728x90" label="728×90 — Hero Bottom" dismissible />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ TRENDING AI VISUALS ═══════════════ */}
        <AiGallerySection onCardClick={openPopup} />

        {/* ── AD: Below Gallery (Leaderboard) ── */}
        <AdBanner id="below-hero" slot="below-hero-728x90" label="728×90 Leaderboard — Below Gallery" dismissible />

        {/* ── AD: Pre-Features ── */}
        <AdBanner id="pre-features" slot="pre-features-728x90" label="728×90 — Pre Features" dismissible />

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="py-20 sm:py-28" id="features" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                id="features-heading"
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Why Millions Trust{" "}
                <span className="text-gradient">VaultStream</span> for Private
                Video Streaming
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-4 text-muted-foreground"
              >
                Enterprise-grade security, lightning-fast streaming, and
                absolute privacy — built into every feature.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((f) => (
                <motion.article
                  key={f.title}
                  variants={fadeUp}
                  custom={0}
                  className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:border-rose-500/30 hover:bg-white/[0.03]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-500/20">
                    <f.icon className="h-5 w-5 text-rose-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── AD: Post-Features ── */}
        <AdBanner id="post-features" slot="post-features-728x90" label="728×90 — Post Features" dismissible />

        {/* ── AD: Between Features & How It Works ── */}
        <AdBanner id="mid-page-1" slot="mid-page-1-728x90" label="728×90 Leaderboard — Mid Page 1" dismissible />

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="py-20 sm:py-28" id="how-it-works" aria-labelledby="how-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                id="how-heading"
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                How to Access Private Videos on{" "}
                <span className="text-gradient">VaultStream</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-4 text-muted-foreground"
              >
                Start watching exclusive content in three simple steps. No
                friction, no waiting, no personal data required.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-14 grid gap-8 sm:grid-cols-3"
            >
              {steps.map((s, i) => (
                <motion.article
                  key={s.num}
                  variants={fadeUp}
                  custom={i}
                  className="relative text-center"
                >
                  <div
                    className="text-gradient mx-auto mb-4 text-5xl font-black opacity-20"
                    aria-hidden="true"
                  >
                    {s.num}
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="absolute top-8 -right-4 hidden text-muted-foreground/30 sm:block lg:-right-5" aria-hidden="true">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── AD: Between How It Works & Article ── */}
        <AdBanner id="post-howitworks" slot="post-howitworks-728x90" label="728×90 Leaderboard — Post How It Works" dismissible />

        {/* ── AD: Before Article ── */}
        <AdBanner id="pre-article" slot="pre-article-728x90" label="728×90 Leaderboard — Before Article" dismissible />

        <Separator className="mx-auto max-w-4xl bg-white/5" aria-hidden="true" />

        {/* ═══════════════ SEO CONTENT ARTICLE ═══════════════ */}
        <article className="py-20 sm:py-28" aria-labelledby="article-heading">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                id="article-heading"
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                The Complete Guide to Private Video Streaming Platforms in 2026
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-6 text-muted-foreground leading-relaxed"
              >
                The online video streaming landscape has undergone a dramatic
                transformation in recent years. As privacy concerns dominate
                global conversations and major streaming platforms continue to
                collect increasingly invasive amounts of personal data, a new
                generation of <strong className="text-foreground/80">private video platforms</strong> has emerged.
                These platforms — led by innovators like VaultStream — put the
                viewer first, offering instant access to curated exclusive
                content without the friction of account creation, email
                verification, or payment gateways. In 2026, this movement has
                become the fastest-growing segment of the streaming industry.
              </motion.p>

              <motion.h3
                variants={fadeUp}
                custom={2}
                className="mt-10 text-xl font-semibold"
              >
                Why Private Video Streaming Platforms Are Surging in Popularity
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Industry research reveals that over 68% of internet users now
                cite privacy as their primary concern when accessing online video
                content. Traditional streaming services collect vast troves of
                data — viewing histories, device fingerprints, geolocation data,
                behavioral patterns, and even interaction metrics like pause
                frequency and rewind behavior. This data is then used for
                targeted advertising, algorithmic profiling, and sometimes shared
                with third-party analytics firms.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={4}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                <strong className="text-foreground/80">Private video platforms</strong> like VaultStream
                take a fundamentally different approach. By implementing
                zero-tracking policies, requiring no personal information, and
                using end-to-end encryption, these platforms eliminate the
                privacy trade-off that users have historically accepted. The
                result is a growing exodus of viewers from mainstream services to
                privacy-first alternatives — particularly among the 18–34
                demographic, where 74% report actively seeking more private
                streaming options.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={5}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Beyond privacy, this shift is also about creating a superior user
                experience. When platforms don&apos;t need to process registration
                flows, manage user databases, or serve personalized ads, they can
                redirect those engineering resources toward what actually matters:
                delivering <strong className="text-foreground/80">high-quality video content</strong> with
                lightning-fast load times. The result is a streamlined experience
                where viewers go from discovery to playback in seconds, not
                minutes.
              </motion.p>

              <motion.h3
                variants={fadeUp}
                custom={6}
                className="mt-10 text-xl font-semibold"
              >
                Secure Streaming Technology: Encryption, CDN, and Zero-Logging
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={7}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                At the foundation of VaultStream&apos;s infrastructure lies a
                commitment to security that exceeds industry norms. Every video
                stream is protected with <strong className="text-foreground/80">AES-256 encryption</strong> — the
                same cryptographic standard trusted by financial institutions,
                healthcare organizations, and government agencies worldwide.
                Unlike platforms that only encrypt the initial connection
                (typically via HTTPS), VaultStream encrypts the video payload
                itself, ensuring that even intercepted traffic remains
                unreadable.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={8}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                The platform&apos;s content delivery network (CDN) spans over 200 edge
                locations across 190+ countries, bringing streams as close to
                viewers as physically possible. This architecture dramatically
                reduces latency — the time between clicking play and seeing the
                first frame — to under 500 milliseconds on most connections. For
                context, the industry average for premium streaming platforms is
                1.5 to 3 seconds.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={9}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                <strong className="text-foreground/80">Adaptive bitrate streaming (ABS)</strong> is another
                cornerstone of the platform&apos;s technology. ABS continuously
                monitors your connection speed and device capabilities, then
                dynamically adjusts the video resolution in real-time — from 480p
                on slower mobile connections to full <strong className="text-foreground/80">4K Ultra HD with HDR</strong> on
                fiber or high-speed broadband. This ensures smooth,
                buffer-free playback regardless of network conditions, from 5G to
                DSL.
              </motion.p>

              {/* ── AD: In-Article Midway ── */}
              <InContentAd id="in-article-1" slot="in-article-1-native" label="Native In-Article Ad — Midway" />

              {/* ── AD: In-Article Encryption Section ── */}
              <InContentAd id="in-article-1b" slot="in-article-1b-native" label="Native In-Article Ad — Encryption" />

              <motion.h3
                variants={fadeUp}
                custom={10}
                className="mt-10 text-xl font-semibold"
              >
                No-Signup Access: The Frictionless Streaming Model
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={11}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                One of VaultStream&apos;s most distinctive and popular features is its
                no-signup access model. In a digital landscape where virtually
                every service demands an email address, a password, and often a
                phone number for two-factor authentication, the simplicity of
                instant access is genuinely refreshing. Conversion data from
                similar platforms shows that mandatory registration loses
                approximately 40% of potential viewers at the signup step alone.
                By eliminating this barrier entirely, VaultStream captures and
                retains audiences that traditional platforms bleed away.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={12}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                This approach has profound privacy implications as well. With no
                accounts, there are no passwords to be compromised in data
                breaches. No email addresses to be sold to marketers. No viewing
                histories to be subpoenaed or leaked. It&apos;s truly{" "}
                <strong className="text-foreground/80">ephemeral access</strong> — you visit the platform,
                watch what you want, and leave without leaving any digital
                footprint. For viewers who value both discretion and convenience,
                this model represents the gold standard of online video streaming
                in 2026.
              </motion.p>

              <motion.h3
                variants={fadeUp}
                custom={13}
                className="mt-10 text-xl font-semibold"
              >
                Content Quality, Curation, and Library Size
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={14}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Technology and privacy form the foundation, but what truly
                distinguishes a premium private video platform is the quality and
                breadth of its content library. VaultStream maintains a rigorously
                curated collection of over 50,000 exclusive videos spanning
                diverse categories. Every piece of content undergoes a multi-step
                quality review process before publication — evaluating production
                value, resolution, audio clarity, and overall viewer experience.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={15}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                New exclusive content is added daily, with hundreds of new titles
                introduced each week. The platform&apos;s AI-powered recommendation
                engine helps viewers discover content aligned with their
                preferences — and critically, this system operates without
                storing personal viewing data. Instead, it uses contextual
                signals like time-of-day browsing patterns and trending content to
                surface relevant recommendations, maintaining personalization
                without compromising privacy.
              </motion.p>

              {/* ── AD: In-Article Lower ── */}
              <InContentAd id="in-article-2" slot="in-article-2-native" label="Native In-Article Ad — Lower" />

              {/* ── AD: In-Article 3rd ── */}
              <InContentAd id="in-article-3" slot="in-article-3-native" label="Native In-Article Ad — VPN Section" />

              <motion.h3
                variants={fadeUp}
                custom={16}
                className="mt-10 text-xl font-semibold"
              >
                Cross-Device Compatibility and VPN-Friendly Infrastructure
              </motion.h3>

              <motion.p
                variants={fadeUp}
                custom={17}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                Modern viewers expect seamless experiences across all their
                devices. VaultStream is fully responsive and optimized for iOS,
                Android, Windows, macOS, and Smart TVs. The adaptive interface
                scales from compact mobile screens to ultrawide desktop monitors,
                with touch-friendly controls on touch devices and keyboard
                shortcuts on desktop. Video progress syncs across devices in
                real-time using ephemeral session tokens — not persistent user
                accounts.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={18}
                className="mt-4 text-muted-foreground leading-relaxed"
              >
                The platform is also fully <strong className="text-foreground/80">VPN-friendly</strong>. Unlike many streaming
                services that actively block VPN traffic or serve degraded
                quality through VPN connections, VaultStream&apos;s global CDN
                architecture means VPN users experience the same fast, reliable
                streaming as direct connections. This makes it an ideal choice for
                viewers in regions with restricted internet access or those who
                simply prefer an additional layer of network privacy.
              </motion.p>
            </motion.div>
          </div>
        </article>

        {/* ── AD: Post-Article ── */}
        <AdBanner id="post-article" slot="post-article-728x90" label="728×90 — Post Article" dismissible />

        {/* ── AD: Between Article & FAQ ── */}
        <AdBanner id="pre-faq" slot="pre-faq-728x90" label="728×90 Leaderboard — Before FAQ" dismissible />

        <Separator className="mx-auto max-w-4xl bg-white/5" aria-hidden="true" />

        {/* ═══════════════ FAQ ═══════════════ */}
        <section className="py-20 sm:py-28" id="faq" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="text-center"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                id="faq-heading"
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Frequently Asked Questions About{" "}
                <span className="text-gradient">VaultStream</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-4 text-muted-foreground"
              >
                Detailed answers to the most common questions about our private
                video streaming platform.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-12"
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={i}
                    className="glass-card rounded-xl px-4 transition-all duration-300 hover:border-rose-500/20"
                  >
                    <AccordionItem value={`faq-${i}`} className="border-b-0">
                      <AccordionTrigger className="py-5 text-left text-sm font-medium sm:text-base">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ── AD: Post-FAQ ── */}
        <AdBanner id="post-faq" slot="post-faq-728x90" label="728×90 — Post FAQ" dismissible />

        {/* ── AD: Between FAQ & Final CTA ── */}
        <AdBanner id="pre-cta" slot="pre-cta-728x90" label="728×90 Leaderboard — Before CTA" dismissible />

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="py-20 sm:py-28" id="watch-now" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="glass-card relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20"
            >
              <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-rose-500/15 blur-[80px]" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-violet-500/15 blur-[80px]" aria-hidden="true" />

              <div className="relative z-10">
                <motion.h2
                  variants={fadeUp}
                  custom={0}
                  id="cta-heading"
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Start Streaming Private Videos Now
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  custom={1}
                  className="mx-auto mt-4 max-w-lg text-muted-foreground"
                >
                  Join 2.4 million viewers who trust VaultStream for secure,
                  private, and instant HD &amp; 4K video access. No account
                  needed — click and watch.
                </motion.p>

                {/* Checklist */}
                <motion.ul
                  variants={fadeUp}
                  custom={2}
                  className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left text-sm text-muted-foreground"
                  aria-label="VaultStream benefits checklist"
                >
                  {[
                    "Free instant access — no signup, no credit card",
                    "50,000+ exclusive private HD & 4K videos",
                    "AES-256 encrypted streaming with zero logging",
                    "Works on all devices — mobile, desktop, and Smart TV",
                    "VPN-friendly — accessible from 190+ countries",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="mt-10 flex flex-col items-center gap-3"
                >
                  <Button
                    onClick={openPopup}
                    size="lg"
                    className="animate-glow h-13 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-10 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
                  >
                      <Play className="mr-2 h-5 w-5 fill-white" aria-hidden="true" />
                      Watch Now — Free Instant Access
                      <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" aria-hidden="true" /> AES-256 Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" /> Zero Logging
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" /> Instant Access
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" aria-hidden="true" /> Free Forever
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── AD: After Final CTA / Before Disclaimer ── */}
        <AdBanner id="post-cta" slot="post-cta-728x90" label="728×90 Leaderboard — Post CTA" dismissible />

        {/* ═══════════════ 18+ DISCLAIMER ═══════════════ */}
        <section className="py-8" aria-label="Age restriction disclaimer">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="glass-card rounded-xl px-5 py-4 text-center" role="alert">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground/70">18+ Age Restriction Notice:</strong>{" "}
                This platform is intended exclusively for adults aged 18 years
                and older. By accessing VaultStream, you represent and warrant
                that you meet the minimum legal age requirement in your
                jurisdiction. All content hosted on this platform is curated,
                legally compliant, and moderated in accordance with applicable
                regulations. We do not host, distribute, or tolerate
                non-consensual content of any kind. If you are under the age of
                18, you must exit this site immediately. VaultStream employs
                proactive content moderation and complies with DMCA, USC 2257,
                and all relevant international content regulations.
              </p>
            </div>
          </div>
        </section>

        {/* ── AD: Post-Disclaimer ── */}
        <AdBanner id="post-disclaimer" slot="post-disclaimer-728x90" label="728×90 — Post Disclaimer" dismissible />

      </main>

      {/* ── AD: Pre-Footer (after all main content) ── */}
      <AdBanner id="pre-footer" slot="pre-footer-728x90" label="728×90 Leaderboard — Pre Footer" />

      {/* ── AD: Sticky Mobile Bottom Bar ── */}
      <MobileStickyAd id="mobile-sticky" slot="mobile-sticky-320x50" />

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/5 py-10" role="contentinfo">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <a href="/" className="flex items-center gap-2.5" aria-label="VaultStream Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-violet-500">
                <Play className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Vault<span className="text-gradient">Stream</span>
              </span>
            </a>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer navigation">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                DMCA Compliance
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Content Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact Support
              </a>
              <a href="#faq" className="hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          <Separator className="my-6 bg-white/5" aria-hidden="true" />

          {/* ── AD: Inside Footer ── */}
          <div className="my-4">
            <AdBanner id="footer-inline" slot="footer-inline-728x90" label="728×90 Leaderboard — Footer" dismissible />
          </div>

          <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} VaultStream. All rights
              reserved. This website is intended for adults aged 18 and older.
            </p>
            <p>
              Unauthorized reproduction, distribution, or scraping of this
              website&apos;s content is strictly prohibited and subject to legal
              action under applicable international copyright laws.
            </p>
          </div>
        </div>
      </footer>

      {/* ── AD: Very Bottom (last thing on page) ── */}
      <div className="pb-4">
        <AdBanner id="bottom-trap" slot="bottom-trap-728x90" label="728×90 Leaderboard — Page Bottom" />
      </div>
    </div>
    </>
  );
}
