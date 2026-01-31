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
    default: "Petal & Pup | Fashion & Lifestyle",
    template: "%s | Petal & Pup"
  },
  description: "Curated collections for the modern lifestyle. Shop our latest arrivals in dresses, tops, and accessories.",
  keywords: ["fashion", "clothing", "dresses", "lifestyle", "boutique"],
  authors: [{ name: "Petal & Pup Team" }],
  creator: "Petal & Pup",
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
