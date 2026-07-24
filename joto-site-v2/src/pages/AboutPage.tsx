import { ArrowUpRight } from "lucide-react";
import InteriorPageHero from "../components/InteriorPageHero";
import { Reveal } from "../components/SectionHeading";
import SiteFooter from "../components/SiteFooter";
import { useI18n } from "../i18n/I18nProvider";
import { pageHref } from "../lib/anchors";

const heritage = ["IBM", "Microsoft", "Apple", "SAP"];

const aboutPageStats = [
  { value: "2010", label: "Founded in Shanghai" },
  { value: "10", label: "Cities worldwide" },
  { value: "Fortune 500", label: "Clients served for a decade+" },
  { value: "24×7", label: "Support & maintenance" },
];

const deliverySteps = [
  {
    title: "Plan & Design",
    description:
      "Requirements, architecture and cross-border planning grounded in how your business actually operates.",
  },
  {
    title: "Build & Integrate",
    description:
      "One accountable engineering team across network, security, data center and physical systems.",
  },
  {
    title: "Run & Improve",
    description:
      "Managed services, on-site helpdesk and 24×7 maintenance throughout the technology lifecycle.",
  },
];

export default function AboutPage() {
  const { locale, siteContent, t } = useI18n();
  const { about, contact, globalPresence } = siteContent;
  const localizedDeliverySteps = deliverySteps.map((step) => ({ title: t(step.title), description: t(step.description) }));

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <InteriorPageHero
        eyebrow={t("ABOUT US")}
        title={
          locale === "zh-CN" ? (
            <>
              <span
                className="block whitespace-nowrap text-[0.82em] sm:text-[1em]"
                data-about-title-line
              >
                让复杂 <em className="font-serif font-normal text-joto-green">IT</em> 项目
              </span>
              <span className="block whitespace-nowrap" data-about-title-line>
                顺利落地。
              </span>
            </>
          ) : (
            <>
              {t("Built to make")}
              <br />
              {t("complex")} <em className="font-serif font-normal text-joto-green">IT</em>{" "}
              {t("happen.")}
            </>
          )
        }
        description={t("A customer-oriented technology company turning demanding enterprise requirements into reliable, connected systems since 2010.")}
        narrowRail
        titleId="about-page-title"
      />

      <section
        className="px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-36"
        data-about-who-we-are
      >
        <div className="mx-auto max-w-6xl border-t border-white/15 pt-6">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/52">
              {t("Who we are")}
            </p>
          </Reveal>
          <div
            className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
            data-about-who-we-are-layout
          >
            <Reveal>
              <div className="space-y-5 text-base leading-7 text-white/62 md:text-lg md:leading-8">
                <p>
                  {t("JOTO TECH provides comprehensive IT solutions across networks, security, data centers, collaboration and physical safeguarding — alongside planning, consulting and managed services.")}
                </p>
                <p>
                  {t("Our senior team brings experience from")} {heritage.join(", ")}{t(", with a track record of supporting complex environments for global enterprises.")}
                </p>
                <p>{about.secondary}</p>
              </div>
              <blockquote className="mt-10 border-l-2 border-joto-green pl-6 font-serif text-3xl italic leading-tight text-white md:text-4xl">
                {locale === "zh-CN" ? (
                  <>
                    “专业服务，持续创新，
                    <br />
                    以客户成功为目标。”
                  </>
                ) : (
                  <>“{t("Professional service. Innovation first. Customer success always.")}”</>
                )}
              </blockquote>
            </Reveal>
            <dl
              className="grid self-start gap-4 sm:grid-cols-2 lg:h-full lg:grid-cols-2 lg:grid-rows-2 lg:self-stretch"
              data-about-page-stats
            >
              {aboutPageStats.map((stat, index) => {
                const isVeryLongValue = stat.value.length > 11;
                const isLongValue = stat.value.length > 7;
                const valueSizeClass = isVeryLongValue
                  ? "text-[clamp(1.25rem,2vw,1.8rem)]"
                  : isLongValue
                    ? "text-[clamp(1.35rem,2.2vw,1.75rem)]"
                    : "text-[clamp(2.3rem,3.6vw,3.4rem)]";

                return (
                  <Reveal className="h-full" delay={index * 70} key={stat.label}>
                    <div
                      className="group relative flex h-full min-h-[8.75rem] min-w-0 flex-col justify-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#090e0c] px-6 py-6 transition-colors duration-300 hover:border-[#5ed29c]/45 sm:px-7 lg:min-h-0 lg:px-5 lg:py-5"
                      data-about-page-stat-card
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#5ed29c]/[0.06] blur-3xl transition-colors duration-300 group-hover:bg-[#5ed29c]/[0.11]"
                      />
                      <dt
                        className="relative text-sm leading-6 text-white/46 md:text-base"
                        data-about-stat-label
                      >
                        {t(stat.label)}
                      </dt>
                      <dd
                        className={`relative mt-2 min-w-0 whitespace-nowrap font-medium leading-none tracking-[-0.055em] text-[#5ed29c] ${valueSizeClass}`}
                        data-about-page-stat-value
                      >
                        {t(stat.value)}
                      </dd>
                    </div>
                  </Reveal>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-joto-green px-5 py-24 text-joto-ink sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-black/25 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] lg:col-span-3">
              {t("How we work")}
            </p>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.07em] lg:col-span-9">
              {t("Advisors first.")}
              <br />
              {t("Integrators always.")}
            </h2>
          </Reveal>
          <div className="mt-16 grid border-l border-t border-black/25 lg:mt-24 lg:grid-cols-3">
            {localizedDeliverySteps.map((step, index) => (
              <Reveal
                className="flex min-h-72 flex-col border-b border-r border-black/25 p-6 lg:p-8"
                delay={index * 80}
                key={step.title}
              >
                <p className="font-mono text-[10px] tracking-[0.18em]">[ 0{index + 1} ]</p>
                <div className="mt-auto pt-16">
                  <h3 className="text-2xl font-medium tracking-[-0.04em]">{step.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-black/62">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/52 lg:col-span-3">
              {globalPresence.eyebrow}
            </p>
            <div className="lg:col-span-9">
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.07em]">
                {t("Local hands,")}
                <br />
                <span className="font-serif font-normal italic text-joto-green">{t("worldwide.")}</span>
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 md:text-lg">
                {globalPresence.description}
              </p>
            </div>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:mt-24 lg:grid-cols-6">
            {globalPresence.regions.map((region, index) => (
              <Reveal className="border-t border-white/18 pt-4" delay={index * 55} key={region.region}>
                <h3 className="text-sm font-semibold">{region.region}</h3>
                <p className="mt-3 text-xs leading-5 text-white/45">{region.cities.join(" · ")}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/12 px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <Reveal className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-joto-green">
              {t("Start a conversation")}
            </p>
            <h2 className="mt-7 max-w-5xl text-[clamp(3.2rem,7.5vw,8rem)] font-medium leading-[0.86] tracking-[-0.07em]">
              {t("Let’s make what’s next happen.")}
            </h2>
          </div>
          <a
            className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-joto-green text-joto-ink transition-transform hover:-translate-y-1 md:h-24 md:w-24"
            href={pageHref("/contact", true)}
            aria-label={t("Open the JOTO contact page")}
          >
            <ArrowUpRight className="h-8 w-8 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <a className="sr-only" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
