import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteContent } from "../content/en";

export const NAV_LINKS = siteContent.nav;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

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

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {NAV_LINKS.map((link) => (
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
          className="flex min-h-[100svh] flex-col justify-center gap-5 px-7 pb-10 pt-24 sm:px-10"
        >
          {NAV_LINKS.map((link, index) => (
            <a
              className={`border-b border-white/10 pb-5 font-sans text-[clamp(2rem,10vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-white transition-[color,transform,opacity] duration-500 hover:translate-x-2 hover:text-joto-green ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              href={link.href}
              key={link.href}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${100 + index * 45}ms` : "0ms" }}
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
