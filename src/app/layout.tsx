import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://vaultstream.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ─── Primary Meta ─── */
  title: "Private Video Platform (2026) – Instant Access | VaultStream",
  description:
    "Stream exclusive private HD & 4K videos instantly — no signup, no credit card. VaultStream offers secure encrypted streaming with zero tracking. 50,000+ premium videos available worldwide.",
  keywords: [
    "private video platform",
    "private video streaming",
    "secure streaming platform",
    "no signup video streaming",
    "instant video access",
    "private video library",
    "HD streaming no account",
    "4K video streaming",
    "premium video platform",
    "encrypted video streaming",
    "private video access 2026",
    "VaultStream",
    "watch private videos online",
    "free video streaming no signup",
    "anonymous video streaming",
    "adult video platform",
    "exclusive video content",
    "private content platform",
    "secure video viewer",
    "no registration streaming",
  ],

  /* ─── Authors & Publisher ─── */
  authors: [{ name: "VaultStream", url: SITE_URL }],
  creator: "VaultStream",
  publisher: "VaultStream",

  /* ─── Canonical & Alternates ─── */
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "en-GB": SITE_URL,
      "en-AU": SITE_URL,
      "en-CA": SITE_URL,
    },
  },

  /* ─── Open Graph (Facebook, LinkedIn, etc.) ─── */
  openGraph: {
    title: "Private Video Platform (2026) – Instant Access | VaultStream",
    description:
      "Stream 50,000+ exclusive private videos in HD & 4K. No signup required. End-to-end encrypted, zero tracking. The #1 private video platform trusted by 2.4M+ viewers.",
    url: SITE_URL,
    siteName: "VaultStream",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1152,
        height: 864,
        alt: "VaultStream — Private Video Platform with Instant HD Streaming Access",
        type: "image/png",
      },
    ],
  },

  /* ─── Twitter Card ─── */
  twitter: {
    card: "summary_large_image",
    title: "Private Video Platform (2026) – Instant Access | VaultStream",
    description:
      "Stream 50,000+ exclusive private videos in HD & 4K. No signup, encrypted, private. Join 2.4M+ viewers.",
    images: ["/og-image.png"],
    creator: "@vaultstream",
  },

  /* ─── Robots & Crawling ─── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ─── Icons ─── */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  /* ─── Other ─── */
  category: "Entertainment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href={SITE_URL} />
        {/* Preload hero image for LCP */}
        <link
          rel="preload"
          as="image"
          href="/hero-bg.png"
          type="image/png"
        />
        {/* Verification placeholder (replace with real keys) */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
