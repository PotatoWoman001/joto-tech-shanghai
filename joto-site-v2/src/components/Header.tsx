import { useEffect, useId, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteContent } from "../content/en";
import { vendorAnchor } from "../lib/anchors";

export const NAV_LINKS = siteContent.nav;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [activeSolutionCategory, setActiveSolutionCategory] = useState<string | null>("network");
  const menuId = useId();

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
          href="#top"
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
          <div className="group">
            <a
              className="inline-flex items-center gap-1.5 font-sans text-[16px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green"
              href="#solutions"
            >
              SOLUTIONS
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
            </a>
            <div className="pointer-events-none invisible absolute right-0 top-[50px] w-[min(1100px,92vw)] translate-y-2 border border-white/15 bg-[#08100d]/95 p-7 opacity-0 shadow-2xl backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-joto-green">
                Solutions / Category / Vendor
              </p>
              <div className="grid grid-cols-5 gap-px bg-white/10">
                {siteContent.solutions.categories.map((category) => (
                  <div className="bg-[#08100d] p-4" key={category.id}>
                    <a
                      className="text-sm font-semibold text-white transition-colors hover:text-joto-green"
                      href={`#solution-${category.id}`}
                    >
                      {category.title}
                    </a>
                    <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                      {category.vendors.map((vendor) => (
                        <a
                          className="block text-[11px] leading-4 text-white/55 transition-colors hover:text-white"
                          href={vendorAnchor(category.id, vendor.name)}
                          key={vendor.name}
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
          {NAV_LINKS.slice(1).map((link) => (
            <a
              className="font-sans text-[16px] font-medium text-white transition-colors duration-300 hover:text-joto-green focus-visible:text-joto-green"
              href={link.href}
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
                href="#solutions"
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
                                  href={vendorAnchor(category.id, vendor.name)}
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
              href={link.href}
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
