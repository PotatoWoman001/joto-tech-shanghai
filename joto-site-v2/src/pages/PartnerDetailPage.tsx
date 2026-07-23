import { ArrowDownRight, ArrowRight, Check, Compass, Headphones, Wrench } from "lucide-react";
import CustomerLogoWall from "../components/CustomerLogoWall";
import Header from "../components/Header";
import NetworkTelemetryScreen, { NetworkTelemetryReadouts } from "../components/NetworkTelemetryScreen";
import SectionHeading, { Reveal } from "../components/SectionHeading";
import type { PartnerDetail } from "../content/partners";
import { useI18n } from "../i18n/I18nProvider";
import { pageHref } from "../lib/anchors";

interface PartnerDetailPageProps {
  detail: PartnerDetail;
}

const sectionShell = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

const serviceIcons = {
  compass: Compass,
  wrench: Wrench,
  headphones: Headphones,
};

const partnerBadgeStyles: Record<
  PartnerDetail["partnerBadge"],
  { dot: string; pill: string }
> = {
  "Gold Partner": {
    pill:
      "border-[#f2cf5b]/55 bg-[#f2cf5b]/10 text-[#ffe481] shadow-[0_0_24px_rgba(242,207,91,0.12)]",
    dot: "bg-[#ffd447] shadow-[0_0_10px_rgba(255,212,71,0.9)]",
  },
  "Platinum Partner": {
    pill:
      "border-white/35 bg-white/[0.06] text-white/85 shadow-[0_0_22px_rgba(220,235,232,0.1)]",
    dot: "bg-white/90 shadow-[0_0_9px_rgba(230,242,239,0.7)]",
  },
  Partner: {
    pill:
      "border-joto-green/35 bg-joto-green/[0.08] text-joto-green shadow-[0_0_20px_rgba(94,210,156,0.08)]",
    dot: "bg-joto-green shadow-[0_0_9px_rgba(94,210,156,0.65)]",
  },
};

function PartnershipBadge({ badge }: { badge: PartnerDetail["partnerBadge"] }) {
  const styles = partnerBadgeStyles[badge];

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.04em] ${styles.pill}`}
      data-partner-badge={badge}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {badge}
    </span>
  );
}

function GridLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      {["left-1/4", "left-1/2", "left-3/4"].map((position) => (
        <span className={`absolute inset-y-0 w-px bg-white/[0.07] ${position}`} key={position} />
      ))}
    </div>
  );
}

export default function PartnerDetailPage({ detail }: PartnerDetailPageProps) {
  const { t } = useI18n();
  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <section
        aria-labelledby="partner-hero-title"
        className="relative min-h-[900px] overflow-hidden border-b border-white/10 bg-[#070b0a] lg:min-h-screen"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_76%_43%,rgba(94,210,156,0.15),transparent_34%),linear-gradient(180deg,transparent_55%,#070b0a_100%)]"
        />
        <GridLines />
        <Header />

        <div className={`${sectionShell} relative z-10 grid min-h-[900px] gap-12 pb-14 pt-32 lg:min-h-screen lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-16 lg:pt-28`}>
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-joto-green">
                  {detail.eyebrow}
                </p>
                <span className="h-px w-12 bg-white/20" />
                <p className="font-mono text-[10px] tracking-[0.18em] text-white/40">01 / 05</p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="flex items-center gap-4">
                  <img
                    alt={`${detail.partnerName} logo`}
                    className="max-h-7 w-auto max-w-[132px] object-contain brightness-0 invert"
                    data-partner-lockup-logo
                    src={detail.partnerLogo}
                  />
                  <span className="text-2xl font-light text-white/28">×</span>
                  <span className="text-xl font-extrabold tracking-[-0.055em] text-white">JOTO</span>
                </div>
                <div className="basis-full lg:basis-auto">
                  <PartnershipBadge badge={detail.partnerBadge} />
                </div>
              </div>

              <h1
                className="mt-10 max-w-[900px] font-medium leading-[0.88] tracking-[-0.065em]"
                id="partner-hero-title"
              >
                <span
                  className={`block ${
                    detail.partnerName.length > 14
                      ? "text-[clamp(2.45rem,4vw,4.7rem)]"
                      : "text-[clamp(3rem,5.7vw,6rem)]"
                  } lg:whitespace-nowrap`}
                  data-partner-title-line
                >
                  {detail.title}
                </span>
                <em className="mt-2 block font-serif text-[clamp(2.8rem,6.64vw,6.72rem)] font-normal tracking-[-0.045em] text-joto-green">
                  {detail.accent}
                </em>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/60 md:text-lg md:leading-8 lg:max-w-[30rem] xl:max-w-2xl">
                {detail.introduction}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  className="group inline-flex items-center gap-3 rounded-full bg-joto-green px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-[#070b0a] transition-transform hover:-translate-y-0.5"
                  href={detail.cases.length > 0 ? "#partner-case-studies" : "#partner-services"}
                >
                  {detail.cases.length > 0
                    ? `${t("View")} ${detail.partnerName} ${t("case studies")}`
                    : `${t("Explore")} ${detail.partnerName} ${t("services")}`}
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
                <a
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-white/50"
                  href={pageHref("/contact", true)}
                >
                  {t("Contact JOTO")}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal
            className={`relative lg:col-span-5 ${detail.heroVisual.telemetry ? "lg:translate-y-14" : ""}`}
            delay={120}
          >
            {detail.heroVisual.telemetry && (
              <div data-network-telemetry>
                <NetworkTelemetryReadouts />
              </div>
            )}
            <div
              className={`relative -mx-8 sm:mx-0 ${
                detail.heroVisual.telemetry
                  ? "lg:-ml-8 lg:mr-[-3vw] xl:-ml-28 xl:mr-[-7vw]"
                  : "lg:-ml-10"
              }`}
              data-cisco-device-stage={detail.heroVisual.telemetry ? "true" : undefined}
            >
              <div
                aria-hidden="true"
                className="absolute inset-[12%] rounded-full bg-joto-green/10 blur-3xl"
              />
              <div
                className={`relative z-10 w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] ${
                  detail.heroVisual.telemetry
                    ? "aspect-[690/288]"
                    : "aspect-[4/3] overflow-hidden rounded-[24px] border border-white/12"
                }`}
              >
                <img
                  alt={detail.heroVisual.alt}
                  className={`absolute inset-0 h-full w-full ${
                    detail.heroVisual.telemetry ? "object-contain" : "object-cover"
                  }`}
                  src={detail.heroVisual.src}
                />
                {!detail.heroVisual.telemetry && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#070b0a]/65 via-transparent to-transparent"
                  />
                )}
                {detail.heroVisual.telemetry && <NetworkTelemetryScreen />}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="bg-[#090e0d] pb-0 pt-24 sm:pt-28 lg:pt-36"
        id="partner-relationship"
      >
        <div className={sectionShell}>
          <SectionHeading
            eyebrow={`${detail.partnerName} × JOTO`}
            index="02"
            title={detail.relationshipTitle}
            description={detail.relationshipDescription}
          />
          <div className="mt-16 grid border-l border-t border-white/12 lg:grid-cols-3">
            {detail.reasons.map((reason, index) => (
              <Reveal
                className="group min-h-[300px] border-b border-r border-white/12 p-7 transition-colors hover:bg-white/[0.025] sm:p-9"
                delay={index * 80}
                key={reason.title}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-joto-green">
                  0{index + 1}
                </p>
                <h3 className="mt-20 text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">
                  {reason.title}
                </h3>
                <p className="mt-5 max-w-md text-sm leading-6 text-white/52">
                  {reason.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-16 sm:mt-20 lg:mt-24" data-partner-customer-logo-wall>
          <CustomerLogoWall />
        </div>
      </section>

      <section className="bg-[#070b0a] py-16 sm:py-20 lg:py-12" id="partner-services">
        <div className={sectionShell}>
          <SectionHeading
            eyebrow={`JOTO ${detail.partnerName} ${t("Services")}`}
            index="03"
            title={detail.servicesTitle}
            description={detail.servicesDescription}
          />
          <div className="mt-10 grid gap-4 lg:mt-8 lg:grid-cols-3">
            {detail.services.map((service, index) => {
              const ServiceIcon = serviceIcons[service.icon];

              return (
                <Reveal className="h-full" delay={index * 90} key={service.title}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/12 bg-[#080d0c] transition-colors hover:border-white/20">
                    <div className="relative">
                      <div className="aspect-[16/9] overflow-hidden md:aspect-[2/1]">
                        <img
                          alt={service.imageAlt}
                          className={`h-full w-full object-cover ${service.imagePosition} transition-transform duration-700 group-hover:scale-[1.025]`}
                          loading="lazy"
                          src={service.image}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#080d0c]/55 via-transparent to-transparent"
                        />
                      </div>
                      <div
                        aria-label={`${service.title} icon`}
                        className="absolute bottom-0 left-6 grid h-11 w-11 translate-y-1/2 place-items-center rounded-[12px] border border-joto-green/45 bg-joto-green/10 text-joto-green shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:left-7"
                      >
                        <ServiceIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 pt-10 sm:p-7 sm:pt-10">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
                        0{index + 1}
                      </span>
                      <h3 className="mt-4 text-2xl font-medium tracking-[-0.045em] sm:text-[1.65rem]">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/52">{service.description}</p>
                      <ul className="mt-5 space-y-2 border-t border-white/12 pt-4">
                        {service.capabilities.map((capability) => (
                          <li
                            className="flex items-start gap-3 text-xs leading-5 text-white/64"
                            key={capability}
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-joto-green" />
                            {capability}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {detail.cases.length > 0 && (
        <section className="bg-[#090e0d] py-24 sm:py-28 lg:py-36" id="partner-case-studies">
          <div className={sectionShell}>
            <SectionHeading
              eyebrow={detail.casesEyebrow}
              index="04"
              title={detail.casesTitle}
              description={detail.casesDescription}
            />
            <div className="mt-16 divide-y divide-white/12 border-y border-white/12">
              {detail.cases.map((caseStudy, index) => {
                const isPortraitLogo = caseStudy.client === "Harrow International School";

                return (
                  <Reveal key={caseStudy.client}>
                    <article className="group grid gap-8 py-10 lg:grid-cols-12 lg:items-start lg:gap-6 lg:py-14">
                    <div className="flex items-start gap-5 lg:col-span-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-joto-green">
                        0{index + 1}
                      </span>
                      {caseStudy.logo ? (
                        <img
                          alt={`${caseStudy.client} logo`}
                          className={`object-contain object-left opacity-90 ${
                            isPortraitLogo
                              ? "h-24 w-[100px]"
                              : "max-h-12 w-auto max-w-[150px]"
                          } ${caseStudy.logoTreatment === "brand" ? "" : "brightness-0 invert"}`}
                          data-case-logo-size={isPortraitLogo ? "portrait" : "standard"}
                          data-logo-treatment={caseStudy.logoTreatment ?? "monochrome"}
                          loading="lazy"
                          src={caseStudy.logo}
                        />
                      ) : (
                        <span className="max-w-[180px] text-sm font-semibold leading-5 text-white/72">
                          {caseStudy.client}
                        </span>
                      )}
                    </div>
                    <div className="lg:col-span-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        {caseStudy.category}
                      </p>
                      <h3 className="mt-3 text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
                        {caseStudy.client}
                      </h3>
                      <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
                        {caseStudy.brief}
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-joto-green">
                        {caseStudy.tag}
                      </p>
                      <ul className="mt-5 space-y-2.5">
                        {caseStudy.scope.map((item) => (
                          <li className="text-xs leading-5 text-white/52" key={item}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <ArrowRight className="hidden h-5 w-5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-joto-green lg:col-span-1 lg:block" />
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-joto-green text-[#070b0a]" id="contact">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(7,11,10,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(7,11,10,.4)_1px,transparent_1px)] [background-size:25%_100%,25%_100%]" />
        <div className={`${sectionShell} relative py-24 sm:py-28 lg:py-36`}>
          <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] lg:col-span-3">
              05 / {t("Start a project")}
            </p>
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl text-[clamp(3.2rem,7.5vw,8rem)] font-medium leading-[0.86] tracking-[-0.07em]">
                {detail.ctaTitle}
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-black/62 md:text-lg">
                {detail.ctaDescription}
              </p>
              <a
                className="group mt-10 inline-flex items-center gap-4 rounded-full bg-[#070b0a] px-7 py-4 text-xs font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5"
                href={pageHref("/contact", true)}
              >
                {t("Start a conversation")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050807] px-5 py-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5">
          <a className="text-xl font-extrabold tracking-[-0.055em]" href={pageHref("/#top", true)}>
            JOTO
          </a>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/38">
            {detail.partnerName} {t("solutions · designed, deployed and supported by JOTO")}
          </p>
          <a className="text-xs text-white/55 transition-colors hover:text-joto-green" href={`mailto:${detail.contactEmail}`}>
            {detail.contactEmail}
          </a>
        </div>
      </footer>
    </main>
  );
}
