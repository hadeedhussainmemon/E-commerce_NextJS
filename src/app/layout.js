import { Playfair_Display, Inter } from "next/font/google";
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

export const metadata = {
  title: {
    default: "Vanguard OS | Premium Digital Atelier",
    template: "%s | Vanguard OS"
  },
  description: "Experience the zenith of digital curation. Vanguard OS provides a sanctuary for elite connoisseurs seeking masterpieces in horology, leather craft, and lifestyle technology.",
  keywords: ["vanguard", "premium store", "luxury watches", "leather goods", "exclusive accessories"],
  authors: [{ name: "Vanguard Engineering" }],
  creator: "Vanguard OS",
  publisher: "Vanguard OS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vanguard-os.co",
    siteName: "Vanguard OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanguard OS | Premium Digital Atelier",
    description: "Experience the zenith of digital curation.",
    creator: "@vanguard_os",
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${playfair.variable} antialiased bg-white text-slate-900`}
      >
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
