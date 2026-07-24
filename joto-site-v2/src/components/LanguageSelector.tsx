import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import {
  localeMeta,
  locales,
  LOCALE_PREFERENCE_KEY,
  type Locale,
} from "../i18n/routing";

export default function LanguageSelector() {
  const { locale, switchHref, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selectorLabel = t("Language selector");

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [open]);

  const rememberLocale = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_PREFERENCE_KEY, nextLocale);
    } catch {
      // The destination still works when storage is unavailable.
    }
    setOpen(false);
  };

  return (
    <div aria-label={selectorLabel} className="relative" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${localeMeta[locale].label} — ${selectorLabel}`}
        className="inline-flex h-9 min-w-[62px] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.025] px-3 text-[10px] font-semibold text-white/72 transition-colors hover:border-joto-green/55 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-joto-green"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span lang={locale}>{localeMeta[locale].label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          aria-label={selectorLabel}
          className="absolute right-0 top-[calc(100%+0.55rem)] min-w-[126px] overflow-hidden rounded-xl border border-white/15 bg-[#08100d]/98 p-1.5 shadow-2xl backdrop-blur-xl"
          id={menuId}
          role="menu"
        >
          {locales.map((item) => (
            <a
              aria-current={item === locale ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors ${
                item === locale
                  ? "bg-joto-green/14 text-joto-green"
                  : "text-white/58 hover:bg-white/[0.06] hover:text-white"
              }`}
              href={switchHref(item)}
              key={item}
              lang={item}
              onClick={() => rememberLocale(item)}
              role="menuitem"
            >
              {localeMeta[item].label}
              {item === locale ? (
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-joto-green" />
              ) : null}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
