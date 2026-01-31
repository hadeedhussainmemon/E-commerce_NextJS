import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import config from "../config";
import Providers from "../components/Providers";
import ScrollProgress from "../components/UI/ScrollProgress";
import { ToastProvider } from "../context/ToastContext";
import NeuralCursor from "../components/UI/NeuralCursor";
import FloatingHearts from "../components/UI/FloatingHearts";

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
  title: {
    default: "Petal + Pup | Modern Fashion & Lifestyle",
    template: "%s | Petal + Pup"
  },
  description: "Boutique fashion and minimalist lifestyle pieces for the discerning modern observer. Shop our curated collections online.",
  keywords: ["fashion", "clothing", "dresses", "lifestyle", "boutique", "Petal + Pup"],
  authors: [{ name: "Petal + Pup team" }],
  creator: "Petal + Pup",
  publisher: "Petal + Pup",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://petal-plus-pup.vercel.app",
    siteName: "Petal + Pup",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Petal + Pup Fashion Lookbook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petal + Pup | Curated Fashion & Lifestyle",
    description: "Discover minimalist elegance and boutique style curated for the modern observer.",
    creator: "@petalpluspup",
    images: ["/og-image.png"],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} antialiased bg-white text-gray-900 font-sans`}
      >
        <Providers>
          <ToastProvider>
            <ScrollProgress />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
