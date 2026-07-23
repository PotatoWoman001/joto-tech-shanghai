import { useEffect, useId, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteContent } from "../content/en";
import { homeAnchor, pageHref, vendorAnchor } from "../lib/anchors";

export const NAV_LINKS = siteContent.nav;

interface HeaderProps {
  contactHref?: string;
}

export default function Header({ contactHref }: HeaderProps = {}) {
  const fromDetailPage =
    typeof window !== "undefined" && window.location.pathname.startsWith("/solutions/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [desktopSolutionsOpen, setDesktopSolutionsOpen] = useState(false);
  const [activeSolutionCategory, setActiveSolutionCategory] = useState<string | null>("network");
  const menuId = useId();
  const desktopSolutionsId = useId();

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
      if (event.key === "Escape") setDesktopSolutionsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [desktopSolutionsOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setSolutionsOpen(false);
    setActiveSolutionCategory("network");
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          aria-label="JOTO TECH home"
          className="relative z-[70] inline-flex items-center"
          href={homeAnchor("top", fromDetailPage)}
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

        <nav aria-label="Primary navigation" className="relative hidden items-center gap-7 lg:flex xl:gap-9">
          <div
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDesktopSolutionsOpen(false);
              }
            }}
            onFocus={() => setDesktopSolutionsOpen(true)}
            onMouseEnter={() => setDesktopSolutionsOpen(true)}
            onMouseLeave={() => setDesktopSolutionsOpen(false)}
          >
            <button
              aria-controls={desktopSolutionsId}
              aria-expanded={desktopSolutionsOpen}
              className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[16px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green"
              onClick={() => setDesktopSolutionsOpen(true)}
              type="button"
            >
              SOLUTIONS
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  desktopSolutionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              aria-hidden={!desktopSolutionsOpen}
              className={`absolute right-0 top-full w-[min(1100px,92vw)] pt-[28px] transition-[opacity,transform,visibility] duration-300 ${
                desktopSolutionsOpen
                  ? "pointer-events-auto visible translate-y-0 opacity-100"
                  : "pointer-events-none invisible translate-y-2 opacity-0"
              }`}
              id={desktopSolutionsId}
            >
              <div className="border border-white/15 bg-[#08100d]/95 p-7 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-5 gap-px bg-white/10">
                  {siteContent.solutions.categories.map((category) => (
                    <div className="bg-[#08100d] p-4" key={category.id}>
                      <a
                        className="text-sm font-semibold text-white transition-colors hover:text-joto-green"
                        href={homeAnchor(`solution-${category.id}`, fromDetailPage)}
                        onClick={() => setDesktopSolutionsOpen(false)}
                      >
                        {category.title}
                      </a>
                      <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                        {category.vendors.map((vendor) => (
                          <a
                            className="block text-[11px] leading-4 text-white/55 transition-colors hover:text-white"
                            href={pageHref(vendorAnchor(category.id, vendor.name), fromDetailPage)}
                            key={vendor.name}
                            onClick={() => setDesktopSolutionsOpen(false)}
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
          {NAV_LINKS.slice(1).map((link) => (
            <a
              className="font-sans text-[16px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green"
              href={
                link.label === "CONTACT" && contactHref
                  ? contactHref
                  : pageHref(link.href, fromDetailPage)
              }
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-joto-green hover:text-joto-green lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>
      </div>

      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] bg-[#070b0a]/[0.98] transition-[opacity,visibility] duration-500 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={menuId}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex min-h-[100svh] flex-col gap-5 overflow-y-auto px-7 pb-10 pt-28 sm:px-10"
        >
          <div>
            <div className="flex items-center border-b border-white/10 pb-5">
              <a
                className={`font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-white transition-[color,transform,opacity] duration-500 hover:text-joto-green ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                href={homeAnchor("solutions", fromDetailPage)}
                onClick={closeMenu}
              >
                SOLUTIONS
              </a>
              <button
                aria-expanded={solutionsOpen}
                aria-label={solutionsOpen ? "Close solution branches" : "Open solution branches"}
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
                  {siteContent.solutions.categories.map((category) => {
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
                                  href={pageHref(vendorAnchor(category.id, vendor.name), fromDetailPage)}
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
          {NAV_LINKS.slice(1).map((link, index) => (
            <a
              className={`border-b border-white/10 pb-5 font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-white transition-[color,transform,opacity] duration-500 hover:translate-x-2 hover:text-joto-green ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              href={
                link.label === "CONTACT" && contactHref
                  ? contactHref
                  : pageHref(link.href, fromDetailPage)
              }
              key={link.href}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${145 + index * 45}ms` : "0ms" }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
