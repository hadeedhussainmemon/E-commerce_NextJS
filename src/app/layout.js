import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import config from "../config";
import Providers from "../components/Providers";
import ScrollProgress from "../components/UI/ScrollProgress";
import { ToastProvider } from "../context/ToastContext";

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
    default: config.appName,
    template: `%s | ${config.appName}`,
  },
  description: config.description,
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
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
