import { homeAnchor, pageHref } from "../lib/anchors";
import { useI18n } from "../i18n/I18nProvider";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "#services" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact Us", href: "/contact" },
];

function telephoneHref(value: string) {
  return `tel:${value.replace(/[^+\d]/g, "")}`;
}

export default function SiteFooter() {
  const { pathname, siteContent, t } = useI18n();
  const { brand, contact, footer, solutions } = siteContent;
  const fromInteriorPage =
    pathname !== "/" ||
    (typeof window !== "undefined" && window.location.pathname !== "/");
  const shanghai = contact.offices[0];

  return (
    <footer className="border-t border-white/10 bg-[#050807] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.4fr] xl:gap-x-12">
          <div>
            <a
              aria-label={`${brand.name} home`}
              className="inline-flex items-baseline tracking-[-0.04em]"
              href={homeAnchor("top", fromInteriorPage)}
            >
              <span className="text-2xl font-semibold">JOTO</span>
              <span className="text-2xl font-semibold text-joto-green">·</span>
              <span className="text-2xl font-light">TECH</span>
            </a>
            <p className="mt-5 font-serif text-xl italic text-white/65">
              {t("We make IT happen.")}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/42">
              {t("A customer-oriented systems integrator delivering comprehensive IT solutions since 2010.")}
            </p>
          </div>

          <nav aria-label={t("Footer solutions")}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
              {t("SOLUTIONS")}
            </h2>
            <ul className="mt-5 space-y-3">
              {solutions.categories.map((solution) => (
                <li key={solution.id}>
                  <a
                    className="text-sm text-white/68 transition-colors hover:text-joto-green"
                    href={homeAnchor(`solution-${solution.id}`, fromInteriorPage)}
                  >
                    {solution.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("Footer company")}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
              {t("Company")}
            </h2>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="text-sm text-white/68 transition-colors hover:text-joto-green"
                    href={pageHref(link.href, fromInteriorPage)}
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
              {t("Contact")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-white/68">
              <li>
                <a
                  className="transition-colors hover:text-joto-green"
                  href={telephoneHref(contact.hotline)}
                >
                  {t("Hotline")}: <bdi>{contact.hotline}</bdi>
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-joto-green"
                  href={telephoneHref(contact.phone)}
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-joto-green"
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                </a>
              </li>
              <li className="max-w-sm pt-2 leading-6 text-white/40">{shanghai.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs leading-5 text-white/35 sm:flex-row sm:gap-8">
          <p>
            © {new Date().getFullYear()} {contact.companyEn} {contact.companyCn} ·{" "}
            <a
              className="transition-colors hover:text-white/60"
              href="https://beian.miit.gov.cn"
              rel="noopener noreferrer"
              target="_blank"
            >
              {footer.icp}
            </a>
          </p>
          <p className="sm:text-right">
            {t("Professional Service · Innovation as Priority · Customer Success First")}
          </p>
        </div>
      </div>
    </footer>
  );
}
