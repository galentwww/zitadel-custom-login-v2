import { CSSProperties, ReactNode } from "react";

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

type Hero = { landscape: string; portrait: string };

const DEFAULT_HERO: Hero = { landscape: "/brand/hero.jpg", portrait: "/brand/hero-portrait.jpg" };

// Per-organization illustrations; organizations not listed get DEFAULT_HERO.
// The landscape (mobile banner) art is still being designed, so it falls back
// to the default for now.
const ORG_HEROES: Record<string, Hero> = {
  // 稀饭ACG staff
  "392691124596113410": { landscape: DEFAULT_HERO.landscape, portrait: "/brand/heros/staff.jpg" },
  // 稀饭acg (portal)
  "393441215200100364": { landscape: DEFAULT_HERO.landscape, portrait: "/brand/heros/portal.jpg" },
};

const heroVars = (hero: Hero) => ({
  "--xf-hero": `url("${asset(hero.landscape)}")`,
  "--xf-hero-portrait": `url("${asset(hero.portrait)}")`,
});

/**
 * Overrides the shell's illustration with the one of the given organization.
 * Rendered by DynamicTheme, which knows the organization; the shell itself
 * sits in the layout and only shows the default.
 */
export function BrandHero({ organizationId }: { organizationId?: string }) {
  const hero = organizationId ? ORG_HEROES[organizationId] : undefined;
  if (!hero) {
    return null;
  }
  // !important beats the default set inline on the shell element.
  const declarations = Object.entries(heroVars(hero)).map(([name, value]) => `${name}:${value}!important;`);
  return <style>{`[data-xf-hero]{${declarations.join("")}}`}</style>;
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
          <div
            data-xf-hero
            style={heroVars(DEFAULT_HERO) as CSSProperties}
            className="h-full w-full bg-[image:var(--xf-hero)] bg-cover bg-[position:50%_40%] lg:bg-[image:var(--xf-hero-portrait)] lg:bg-[position:50%_45%] dark:brightness-[0.7] dark:saturate-[0.9]"
          />
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
