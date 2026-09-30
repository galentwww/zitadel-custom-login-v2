"use client";

import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import React, { Children, ReactNode } from "react";
import { ThemeWrapper } from "./theme-wrapper";

/**
 * DynamicTheme renders the content of a login page inside the Xifan brand
 * shell (see brand-shell.tsx, mounted in the layout). The logo and
 * illustration live in the shell, so this only lays out the page content.
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
  branding?: BrandingSettings;
}) {
  const actualChildren: ReactNode =
    typeof children === "function" ? (children as (isSideBySide: boolean) => ReactNode)(false) : children;

  const childArray = Children.toArray(actualChildren);
  const hasTitleAndForm = childArray.length > 1;

  return (
    <ThemeWrapper branding={branding}>
      {hasTitleAndForm ? (
        <div className="flex flex-col space-y-8">
          <div className="xf-heading w-full">{childArray[0]}</div>
          <div className="w-full">{childArray.slice(1)}</div>
        </div>
      ) : (
        <div className="w-full">{actualChildren}</div>
      )}
    </ThemeWrapper>
  );
}
