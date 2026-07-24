import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import { Reveal } from "../components/SectionHeading";
import SiteFooter from "../components/SiteFooter";
import type { Vendor } from "../content/types";
import type { SolutionCategoryDetail } from "../content/solutionCategories";
import { getSolutionCategoryPageLabels } from "../content/solutionCategories";
import { useI18n } from "../i18n/I18nProvider";
import { localizedHref } from "../i18n/routing";
import { vendorAnchor } from "../lib/anchors";

interface SolutionCategoryPageProps {
  detail: SolutionCategoryDetail;
}

function TechnologyPartnerCard({
  categoryId,
  vendor,
}: {
  categoryId: string;
  vendor: Vendor;
}) {
  const { locale } = useI18n();
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <a
      className="group grid min-h-64 border-b border-r border-white/15 p-6 transition-colors hover:bg-joto-green hover:text-joto-ink md:min-h-72 md:p-8"
      data-solution-partner={vendor.name}
      href={localizedHref(vendorAnchor(categoryId, vendor.name), locale)}
    >
      <div className="flex min-h-16 items-start justify-between gap-5">
        {vendor.logo && !logoFailed ? (
          <span className="inline-flex min-h-14 min-w-32 items-center rounded-md bg-[#f2f4f3] px-4 py-3">
            <img
              alt={`${vendor.name} logo`}
              className="max-h-8 max-w-36 object-contain"
              onError={() => setLogoFailed(true)}
              src={vendor.logo}
            />
          </span>
        ) : (
          <span className="text-xl font-semibold">{vendor.name}</span>
        )}
        <ArrowUpRight className="h-5 w-5 shrink-0 text-joto-green transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-joto-ink" />
      </div>
      <div className="mt-auto pt-12">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-medium tracking-[-0.04em]">{vendor.name}</h3>
          {vendor.tier && (
            <span className="rounded-full border border-current/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
              {vendor.tier} Partner
            </span>
          )}
        </div>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/52 transition-colors group-hover:text-black/62">
          {vendor.description}
        </p>
      </div>
    </a>
  );
}

export default function SolutionCategoryPage({ detail }: SolutionCategoryPageProps) {
  const { locale, siteContent } = useI18n();
  const labels = getSolutionCategoryPageLabels(locale);
  const category = siteContent.solutions.categories.find((item) => item.id === detail.id);
  const featuredCase = siteContent.caseStudies.items.find(
    (item) => item.client === detail.featuredCaseClient,
  );

  if (!category) return null;

  return (
    <main
      className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased"
      data-solution-category-page={detail.id}
      id="top"
    >
      <Header />

      <section className="relative isolate min-h-[84svh] overflow-hidden border-b border-white/12 px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-28 lg:pt-40">
        <img
          alt={category.imageAlt}
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          src={category.image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#070b0a_0%,rgba(7,11,10,0.94)_42%,rgba(7,11,10,0.36)_100%)]"
        />
        <div className="mx-auto flex min-h-[calc(84svh-13rem)] max-w-[1440px] items-end">
          <Reveal className="grid w-full gap-12 border-t border-white/22 pt-6 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-joto-green">
                [ {labels.overview} / {String(siteContent.solutions.categories.indexOf(category) + 1).padStart(2, "0")} ]
              </p>
            </div>
            <div className="lg:col-span-9">
              <h1 className="max-w-5xl text-[clamp(4rem,10vw,10rem)] font-medium leading-[0.82] tracking-[-0.075em]">
                {category.title}
              </h1>
              <p className="mt-8 max-w-4xl font-serif text-[clamp(1.7rem,3.8vw,4rem)] italic leading-[1.02] text-joto-green">
                {detail.tagline}
              </p>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/62 md:text-lg md:leading-8">
                {detail.summary}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/48 lg:col-span-3">
              {labels.capabilitiesEyebrow}
            </p>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.07em] lg:col-span-9">
              {labels.capabilitiesTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid border-l border-t border-white/15 md:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {detail.capabilities.map((item, index) => (
              <Reveal
                className="flex min-h-72 flex-col border-b border-r border-white/15 p-6 transition-colors hover:bg-white/[0.035] lg:min-h-80 lg:p-8"
                delay={index * 55}
                key={item.title}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-joto-green">
                  [ {String(index + 1).padStart(2, "0")} ]
                </p>
                <div className="mt-auto pt-16">
                  <h3 className="max-w-sm text-2xl font-medium leading-tight tracking-[-0.045em]">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a100e] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-joto-green lg:col-span-3">
              {labels.partnersEyebrow}
            </p>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.07em] lg:col-span-9">
              {labels.partnersTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid border-l border-t border-white/15 md:grid-cols-2 lg:mt-24">
            {category.vendors.map((vendor, index) => (
              <Reveal delay={Math.min(index * 55, 220)} key={vendor.name}>
                <TechnologyPartnerCard categoryId={category.id} vendor={vendor} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featuredCase && (
        <section className="px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[1440px]">
            <Reveal className="grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/48 lg:col-span-3">
                {labels.caseEyebrow}
              </p>
              <div className="lg:col-span-9">
                <h2 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.07em]">
                  {labels.caseTitle}
                </h2>
                <a
                  className="group mt-14 grid min-h-96 gap-10 border border-white/18 p-7 transition-colors hover:border-joto-green md:grid-cols-2 md:p-10 lg:mt-20"
                  href={localizedHref("/#case-studies", locale)}
                >
                  <div className="flex flex-col">
                    <span className="w-fit rounded-full border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/50">
                      {featuredCase.sector}
                    </span>
                    {featuredCase.logo ? (
                      <span className="mt-auto flex min-h-40 items-end pt-14">
                        <img
                          alt={`${featuredCase.client} logo`}
                          className={`max-h-24 max-w-48 object-contain ${
                            featuredCase.logoTreatment === "original"
                              ? ""
                              : "grayscale brightness-0 invert"
                          }`}
                          src={featuredCase.logo}
                        />
                      </span>
                    ) : (
                      <h3 className="mt-auto pt-14 text-4xl font-semibold">
                        {featuredCase.client}
                      </h3>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-3xl font-medium tracking-[-0.05em]">
                      {featuredCase.client}
                    </h3>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
                      {featuredCase.summary}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {featuredCase.capabilities.map((item) => (
                        <span
                          className="rounded-full border border-white/18 px-3 py-1.5 text-[10px] text-white/52"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-3 pt-12 text-sm font-semibold text-joto-green">
                      {labels.viewCase}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-joto-green px-5 py-24 text-joto-ink sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <Reveal className="mx-auto grid max-w-[1440px] gap-12 border-t border-black/25 pt-6 lg:grid-cols-12 lg:gap-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] lg:col-span-3">
            {labels.ctaEyebrow}
          </p>
          <div className="lg:col-span-9">
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.07em]">
              {labels.ctaTitle}
            </h2>
            <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <p className="max-w-2xl text-base leading-7 text-black/62">
                {labels.ctaDescription}
              </p>
              <a
                className="group inline-flex items-center gap-4 rounded-full bg-joto-ink px-7 py-4 text-sm font-semibold text-white"
                href={localizedHref("/contact", locale)}
              >
                {labels.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
