import "@/styles/globals.scss";

import { BrandShell } from "@/components/brand-shell";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Skeleton } from "@/components/skeleton";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitch from "@/components/theme-switch";
import { LANGS, getLanguage } from "@/lib/i18n";
import { getServiceConfig } from "@/lib/service-url";
import { getAllowedLanguages } from "@/lib/zitadel";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Noto_Sans_SC, Nunito } from "next/font/google";
import { headers } from "next/headers";
import React, { Suspense } from "react";

// Nunito covers Latin glyphs, Noto Sans SC picks up the Chinese ones.
const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-latin",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-cjk",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return { title: t("title") };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const _headers = await headers();
  const { serviceConfig } = getServiceConfig(_headers);

  let languages = LANGS;
  try {
    const settings = await getAllowedLanguages({ serviceConfig });
    if (settings.allowedLanguages?.length) {
      languages = settings.allowedLanguages
        .filter((code) => LANGS.find((l) => l.code === code))
        .map((code) => getLanguage(code));
    }
  } catch (e) {
    console.error("Failed to load supported languages", e);
  }

  return (
    <html className={`${nunito.variable} ${notoSansSC.variable} font-xf`} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>
          <Tooltip.Provider>
            <Suspense
              fallback={
                <BrandShell footer={<ThemeSwitch />}>
                  <Skeleton>
                    <div className="h-40"></div>
                  </Skeleton>
                </BrandShell>
              }
            >
              <LanguageProvider>
                <BrandShell
                  footer={
                    <>
                      <LanguageSwitcher languages={languages} />
                      <ThemeSwitch />
                    </>
                  }
                >
                  {children}
                </BrandShell>
              </LanguageProvider>
            </Suspense>
          </Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
