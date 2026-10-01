import { ReactNode } from "react";

// Public assets are not prefixed with basePath automatically when used in <img>.
const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const LOGO_SIZE = "h-14 w-auto sm:h-16 lg:h-[76px]";

/**
 * Light/dark logo pair. Without sources it renders the bundled Xifan logo;
 * DynamicTheme passes the logo URLs from the ZITADEL branding settings.
 */
export function BrandLogo({
  lightSrc = asset("/brand/logo-light.png"),
  darkSrc = asset("/brand/logo-dark.png"),
  className = "",
}: {
  lightSrc?: string;
  darkSrc?: string;
  className?: string;
}) {
  return (
    <>
      <img src={lightSrc} alt="稀饭ACG" className={`block dark:hidden ${className}`} />
      <img src={darkSrc} alt="稀饭ACG" className={`hidden dark:block ${className}`} />
    </>
  );
}

// Page background = the branding background color itself (shade 500), with the
// ZITADEL defaults as fallback so the first paint matches the hydrated page.
const PAGE_BG = "bg-[var(--theme-light-background-500,#fafafa)] dark:bg-[var(--theme-dark-background-500,#111827)]";

/**
 * Xifan ACG page shell: illustration panel on the left (desktop) or a banner
 * on top (mobile), with the form column on the right.
 */
export function BrandShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className={`${PAGE_BG} min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
      {/* Illustration */}
      <aside className="relative h-48 overflow-hidden sm:h-64 lg:sticky lg:top-0 lg:h-screen lg:p-4">
        <div className="relative h-full w-full overflow-hidden lg:rounded-[28px]">
          {/* Portrait art for the desktop panel (lg = 1024px), landscape art for the mobile banner */}
          <picture>
            <source media="(min-width: 1024px)" srcSet={asset("/brand/hero-portrait.jpg")} />
            <img
              src={asset("/brand/hero.jpg")}
              alt=""
              className="h-full w-full object-cover object-[50%_40%] lg:object-[50%_45%] dark:brightness-[0.7] dark:saturate-[0.9]"
            />
          </picture>
          <div className="absolute bottom-6 left-6 hidden items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 text-sm font-semibold tracking-wide text-[#b83a68] backdrop-blur-md lg:flex dark:border-white/20 dark:bg-white/10 dark:text-white">
            <span className="h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_8px_2px_rgba(249,168,212,0.8)]" />
            稀饭 ACG 统一身份认证平台
          </div>
        </div>
      </aside>

      {/* Form column */}
      <main
        className={`${PAGE_BG} relative -mt-6 flex min-h-[calc(100vh-10.5rem)] flex-col rounded-t-[28px] px-6 sm:-mt-8 sm:min-h-[calc(100vh-14rem)] sm:px-10 lg:mt-0 lg:min-h-screen lg:rounded-none lg:px-16`}
      >
        {/* Default logo. When a page renders a branded logo (DynamicTheme), it is
            positioned over this header and the default is hidden (globals.scss). */}
        <header data-default-logo className="flex items-center pt-6 lg:pt-10">
          <BrandLogo className={LOGO_SIZE} />
        </header>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </div>

        <footer className="text-text-light-secondary-500 dark:text-text-dark-secondary-500 flex flex-wrap items-center justify-between gap-4 pb-6 text-xs lg:pb-8">
          <span>© {new Date().getFullYear()} 稀饭ACG</span>
          <div className="flex items-center gap-3">{footer}</div>
        </footer>
      </main>
    </div>
  );
}
