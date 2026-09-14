import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Arabic, Outfit, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/client";
import { getLocale } from "@/lib/i18n/server";
import { isRtl } from "@/lib/i18n/locales";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-gb-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-gb-display",
  subsets: ["latin"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-gb-arabic",
  subsets: ["arabic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-gb-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goldbook",
  description: "Private gold research desk for Salah & Rayane",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#f4f6f9",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const rtl = isRtl(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${dmSans.variable} ${outfit.variable} ${notoArabic.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className={`flex min-h-full flex-col bg-gb-bg text-gb-ink ${
          rtl ? "font-[family-name:var(--font-gb-arabic)]" : "font-sans"
        }`}
      >
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
