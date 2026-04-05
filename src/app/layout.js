import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import config from "@/config";
import Providers from "@/components/common/Providers";
import ScrollProgress from "@/components/common/UI/ScrollProgress";
import { ToastProvider } from "@/context/ToastContext";
import NeuralCursor from "@/components/common/UI/NeuralCursor";
import FloatingHearts from "@/components/common/UI/FloatingHearts";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: new URL(config.api.baseUrl || 'http://localhost:3000'),
  title: {
    default: `${config.appName} | ${config.tagline}`,
    template: `%s | ${config.appName}`
  },
  description: config.description,
  keywords: ["fashion", "clothing", "dresses", "lifestyle", "boutique", config.appName],
  authors: [{ name: `${config.appName} Team` }],
  creator: config.appName,
  publisher: config.appName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.api.baseUrl,
    siteName: config.appName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${config.appName} Fashion Lookbook`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.appName} | Curated Fashion & Lifestyle`,
    description: config.description,
    creator: config.socials.twitter,
    images: ["/og-image.png"],
  },
  manifest: '/manifest.json',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': config.appName,
  'url': config.api.baseUrl,
  'logo': {
    '@type': 'ImageObject',
    'url': `${config.api.baseUrl}/logo.png`
  },
  'sameAs': [
    `https://www.facebook.com/${config.socials.facebook}`,
    `https://www.instagram.com/${config.socials.instagram}`
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} antialiased bg-white text-gray-900 font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <ToastProvider>
            <ScrollProgress />
            <NeuralCursor />
            <FloatingHearts />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
