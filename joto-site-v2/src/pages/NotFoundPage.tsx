import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import { useI18n } from "../i18n/I18nProvider";
import { localizedHref, type Locale } from "../i18n/routing";

const notFoundCopy: Record<
  Locale,
  {
    title: string;
    description: string;
    links: readonly { label: string; href: string }[];
  }
> = {
  en: {
    title: "Page not found.",
    description: "The page may have moved or the address may be incomplete.",
    links: [
      { label: "Home", href: "/" },
      { label: "Solutions", href: "/#solutions" },
      { label: "Latest insights", href: "/blog" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  "zh-CN": {
    title: "页面未找到。",
    description: "页面可能已移动，或当前地址不完整。",
    links: [
      { label: "首页", href: "/" },
      { label: "解决方案", href: "/#solutions" },
      { label: "最新资讯", href: "/blog" },
      { label: "联系我们", href: "/contact" },
    ],
  },
  "fa-IR": {
    title: "صفحه پیدا نشد.",
    description: "ممکن است صفحه جابه‌جا شده باشد یا نشانی کامل نباشد.",
    links: [
      { label: "صفحه اصلی", href: "/" },
      { label: "راهکارها", href: "/#solutions" },
      { label: "تازه‌ترین دیدگاه‌ها", href: "/blog" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
};

export default function NotFoundPage() {
  const { locale } = useI18n();
  const copy = notFoundCopy[locale];

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased"
    >
      <Header />
      <section className="relative flex min-h-[76svh] items-end overflow-hidden px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(94,210,156,0.12),transparent_32%)]"
        />
        <div className="relative mx-auto w-full max-w-[1440px] border-t border-white/15 pt-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-joto-green">
            JOTO TECH / 404
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-[clamp(3.8rem,9vw,9rem)] font-medium leading-[0.86] tracking-[-0.075em]">
                {copy.title}
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/55">
                {copy.description}
              </p>
            </div>

            <nav
              aria-label="404"
              className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-1"
              data-not-found-links
            >
              {copy.links.map(({ label, href }) => (
                <a
                  className="group flex items-center justify-between gap-6 border-b border-white/15 py-4 text-sm font-medium text-white/72 transition-colors hover:text-joto-green sm:odd:pe-5 sm:even:ps-5 lg:px-0"
                  href={localizedHref(href, locale)}
                  key={href}
                >
                  {label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
