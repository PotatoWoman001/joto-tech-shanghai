import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteContent } from "../content/en";
import { useI18n } from "../i18n/I18nProvider";
import { localeMeta, locales, localizedHref } from "../i18n/routing";
import { homeAnchor, pageHref, vendorAnchor } from "../lib/anchors";

export const NAV_LINKS = siteContent.nav;
const DESKTOP_SOLUTIONS_CLOSE_DELAY_MS = 2500;

export default function Header() {
  const { locale, pathname, siteContent: localizedContent, switchHref, t } = useI18n();
  const fromInteriorPage = pathname !== "/";
  const navLinks = localizedContent.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [desktopSolutionsOpen, setDesktopSolutionsOpen] = useState(false);
  const [desktopSolutionsPinned, setDesktopSolutionsPinned] = useState(false);
  const [activeSolutionCategory, setActiveSolutionCategory] = useState<string | null>("network");
  const desktopSolutionsRootRef = useRef<HTMLDivElement>(null);
  const desktopSolutionsCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const desktopSolutionsId = useId();

  const clearDesktopSolutionsCloseTimer = () => {
    if (desktopSolutionsCloseTimerRef.current === null) return;

    window.clearTimeout(desktopSolutionsCloseTimerRef.current);
    desktopSolutionsCloseTimerRef.current = null;
  };

  const closeDesktopSolutions = () => {
    clearDesktopSolutionsCloseTimer();
    setDesktopSolutionsOpen(false);
    setDesktopSolutionsPinned(false);
  };

  const openDesktopSolutions = () => {
    clearDesktopSolutionsCloseTimer();
    setDesktopSolutionsOpen(true);
  };

  const scheduleDesktopSolutionsClose = () => {
    if (desktopSolutionsPinned) return;

    clearDesktopSolutionsCloseTimer();
    desktopSolutionsCloseTimerRef.current = window.setTimeout(() => {
      setDesktopSolutionsOpen(false);
      desktopSolutionsCloseTimerRef.current = null;
    }, DESKTOP_SOLUTIONS_CLOSE_DELAY_MS);
  };

  const togglePinnedDesktopSolutions = () => {
    clearDesktopSolutionsCloseTimer();

    if (desktopSolutionsOpen && desktopSolutionsPinned) {
      closeDesktopSolutions();
      return;
    }

    setDesktopSolutionsOpen(true);
    setDesktopSolutionsPinned(true);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!desktopSolutionsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      clearDesktopSolutionsCloseTimer();
      setDesktopSolutionsOpen(false);
      setDesktopSolutionsPinned(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [desktopSolutionsOpen]);

  useEffect(() => {
    if (!desktopSolutionsOpen) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (desktopSolutionsRootRef.current?.contains(event.target as Node)) return;

      clearDesktopSolutionsCloseTimer();
      setDesktopSolutionsOpen(false);
      setDesktopSolutionsPinned(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [desktopSolutionsOpen]);

  useEffect(
    () => () => {
      clearDesktopSolutionsCloseTimer();
    },
    [],
  );

  const closeMenu = () => {
    setMenuOpen(false);
    setSolutionsOpen(false);
    setActiveSolutionCategory("network");
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#050806] shadow-[0_10px_30px_rgba(0,0,0,0.24)]"
      dir="ltr"
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          aria-label="JOTO TECH home"
          className="relative z-[70] inline-flex items-center"
          href={localizedHref(homeAnchor("top", fromInteriorPage), locale)}
          onClick={closeMenu}
        >
          <span className="text-xl font-extrabold leading-none tracking-[-0.055em] text-white">
            JOTO
          </span>
          <span className="ml-2 border-l border-white/30 pl-2 text-[9px] font-semibold uppercase leading-[1.15] tracking-[0.2em] text-white/65">
            Tech
            <br />
            Shanghai
          </span>
        </a>

        <nav aria-label={t("Primary navigation")} className="relative hidden items-center gap-5 lg:flex xl:gap-8">
          <div
            data-desktop-solutions-trigger
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                scheduleDesktopSolutionsClose();
              }
            }}
            onFocus={openDesktopSolutions}
            onMouseEnter={openDesktopSolutions}
            onMouseLeave={scheduleDesktopSolutionsClose}
            ref={desktopSolutionsRootRef}
          >
            <button
              aria-controls={desktopSolutionsId}
              aria-expanded={desktopSolutionsOpen}
              className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[14px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green xl:text-[16px]"
              onClick={togglePinnedDesktopSolutions}
              type="button"
            >
              {navLinks[0].label}
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  desktopSolutionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              aria-hidden={!desktopSolutionsOpen}
              className={`fixed left-4 right-4 top-[75px] mx-auto max-w-[1100px] pt-px transition-[opacity,transform,visibility] duration-300 ${
                desktopSolutionsOpen
                  ? "pointer-events-auto visible translate-y-0 opacity-100"
                  : "pointer-events-none invisible translate-y-2 opacity-0"
              }`}
              data-desktop-solutions-directory
              data-menu-pinned={desktopSolutionsPinned ? "true" : "false"}
              id={desktopSolutionsId}
              onMouseEnter={openDesktopSolutions}
              onMouseLeave={scheduleDesktopSolutionsClose}
            >
              <div className="border border-white/15 bg-[#08100d]/95 p-7 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-5 gap-px bg-white/10">
                  {localizedContent.solutions.categories.map((category) => (
                    <div className="bg-[#08100d] p-4" key={category.id}>
                      <a
                        className="text-sm font-semibold text-white transition-colors hover:text-joto-green"
                        href={localizedHref(homeAnchor(`solution-${category.id}`, fromInteriorPage), locale)}
                        onClick={closeDesktopSolutions}
                      >
                        {category.title}
                      </a>
                      <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                        {category.vendors.map((vendor) => (
                          <a
                            className="block text-[11px] leading-4 text-white/55 transition-colors hover:text-white"
                            href={localizedHref(
                              pageHref(vendorAnchor(category.id, vendor.name), fromInteriorPage),
                              locale,
                            )}
                            key={vendor.name}
                            onClick={closeDesktopSolutions}
                          >
                            {vendor.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {navLinks.slice(1).map((link) => (
            <a
              className="font-sans text-[14px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green xl:text-[16px]"
              href={localizedHref(pageHref(link.href, fromInteriorPage), locale)}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className="relative z-[70] ml-auto mr-3 flex items-center gap-3 lg:ml-4 lg:mr-0"
          data-testid="header-actions"
        >
          <a
            className="hidden rounded-full border border-joto-green/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-joto-green hover:text-joto-ink lg:inline-flex xl:px-5 xl:text-[11px]"
            href={localizedHref("/contact", locale)}
          >
            {t("CONTACT")}
          </a>
          <div
            aria-label={t("Language selector")}
            className="flex items-center gap-1 rounded-full border border-white/15 bg-black/15 p-1"
          >
            {locales.map((item) => (
              <a
                aria-current={item === locale ? "page" : undefined}
                className={`rounded-full px-2 py-1.5 text-[10px] font-semibold transition-colors sm:px-2.5 ${
                  item === locale ? "bg-joto-green text-joto-ink" : "text-white/55 hover:text-white"
                }`}
                href={switchHref(item)}
                key={item}
                lang={item}
              >
                {localeMeta[item].label}
              </a>
            ))}
          </div>
        </div>

        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("Close menu") : t("Open menu")}
          className="relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-joto-green hover:text-joto-green lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>
      </div>

      <div
        aria-hidden={!menuOpen}
        className={`absolute inset-x-0 top-full z-[60] h-[calc(100svh-76px)] bg-[#070b0a] transition-[opacity,visibility] duration-500 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={menuId}
      >
        <nav
          aria-label={t("Mobile navigation")}
          className="flex h-full flex-col gap-5 overflow-y-auto px-7 pb-10 pt-8 sm:px-10"
        >
          <div>
            <div className="flex items-center border-b border-white/10 pb-5">
              <a
                className={`font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-white transition-[color,transform,opacity] duration-500 hover:text-joto-green ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                href={localizedHref(homeAnchor("solutions", fromInteriorPage), locale)}
                onClick={closeMenu}
              >
                {navLinks[0].label}
              </a>
              <button
                aria-expanded={solutionsOpen}
                aria-label={solutionsOpen ? t("Close solution branches") : t("Open solution branches")}
                className="ml-auto flex h-11 w-11 items-center justify-center text-white/70"
                onClick={() => setSolutionsOpen((open) => !open)}
                type="button"
              >
                <ChevronDown className={`h-5 w-5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div
              aria-hidden={!solutionsOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                solutionsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-b border-white/10 py-4">
                  {localizedContent.solutions.categories.map((category) => {
                    const categoryOpen = activeSolutionCategory === category.id;

                    return (
                      <div className="border-b border-white/10 last:border-b-0" key={category.id}>
                        <button
                          aria-expanded={categoryOpen}
                          className="flex w-full items-center justify-between py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-joto-green"
                          onClick={() =>
                            setActiveSolutionCategory(categoryOpen ? null : category.id)
                          }
                          tabIndex={solutionsOpen ? 0 : -1}
                          type="button"
                        >
                          {category.title}
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <div
                          aria-hidden={!categoryOpen}
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                            categoryOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-2 pb-4 pl-3">
                              {category.vendors.map((vendor) => (
                                <a
                                  className="block text-sm text-white/55 transition-colors hover:text-white"
                                  href={localizedHref(
                                    pageHref(vendorAnchor(category.id, vendor.name), fromInteriorPage),
                                    locale,
                                  )}
                                  key={vendor.name}
                                  onClick={closeMenu}
                                  tabIndex={solutionsOpen && categoryOpen ? 0 : -1}
                                >
                                  {vendor.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {navLinks.slice(1).map((link, index) => (
            <a
              className={`border-b border-white/10 pb-5 font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-white transition-[color,transform,opacity] duration-500 hover:translate-x-2 hover:text-joto-green ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              href={localizedHref(pageHref(link.href, fromInteriorPage), locale)}
              key={link.href}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${145 + index * 45}ms` : "0ms" }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </a>
          ))}
          <a
            className={`border-b border-joto-green/40 pb-5 font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-joto-green transition-[color,transform,opacity] duration-500 hover:translate-x-2 hover:text-white ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            href={localizedHref("/contact", locale)}
            onClick={closeMenu}
            style={{ transitionDelay: menuOpen ? `${145 + navLinks.length * 45}ms` : "0ms" }}
            tabIndex={menuOpen ? 0 : -1}
          >
            {t("CONTACT")}
          </a>
        </nav>
      </div>
    </header>
  );
}
