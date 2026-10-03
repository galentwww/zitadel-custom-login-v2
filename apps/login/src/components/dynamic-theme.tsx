"use client";

import type { OrgBrandingSettings } from "@/lib/zitadel";
import { Children, ReactNode } from "react";
import { BrandHero, BrandLogo, LOGO_SIZE } from "./brand-shell";
import { ThemeWrapper } from "./theme-wrapper";

/**
 * DynamicTheme renders the content of a login page inside the Xifan brand
 * shell (see brand-shell.tsx, mounted in the layout). The illustration
 * lives in the shell; the logo comes from the branding settings of the
 * current organization and is placed over the shell header, replacing the
 * default Xifan logo. Without a branding logo the default stays. The
 * illustration is swapped per organization (BrandHero).
 *
 * - Two children: first is the heading (title + description), second the form.
 * - Single child: rendered as-is.
 *
 * Function children are still supported for upstream compatibility and
 * always receive `isSideBySide = false`.
 */
export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode | ((isSideBySide: boolean) => ReactNode);
  branding?: OrgBrandingSettings;
}) {
  const actualChildren: ReactNode =
    typeof children === "function" ? (children as (isSideBySide: boolean) => ReactNode)(false) : children;

  const childArray = Children.toArray(actualChildren);
  const hasTitleAndForm = childArray.length > 1;

  // If only one theme has a logo, use it for both.
  const lightLogo = branding?.lightTheme?.logoUrl || branding?.darkTheme?.logoUrl;
  const darkLogo = branding?.darkTheme?.logoUrl || lightLogo;

  return (
    <ThemeWrapper branding={branding}>
      <BrandHero organizationId={branding?.organizationId} />
      {lightLogo && (
        // Positioned against the shell's <main>, matching its header padding.
        <div data-brand-logo className="absolute top-6 left-6 sm:left-10 lg:top-10 lg:left-16">
          <BrandLogo lightSrc={lightLogo} darkSrc={darkLogo} className={LOGO_SIZE} />
        </div>
      )}
      {hasTitleAndForm ? (
        // xf-rise sits below the logo: a transform on an ancestor would make it the logo's containing block.
        <div className="xf-rise flex flex-col space-y-8">
          <div className="xf-heading w-full">{childArray[0]}</div>
          <div className="w-full">{childArray.slice(1)}</div>
        </div>
      ) : (
        <div className="xf-rise w-full">{actualChildren}</div>
      )}
    </ThemeWrapper>
  );
}
