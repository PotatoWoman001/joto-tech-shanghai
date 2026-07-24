import {
  Activity,
  ArrowUpRight,
  Bell,
  Boxes,
  CircleUserRound,
  ClipboardCheck,
  Cloud,
  Database,
  DoorOpen,
  GitBranch,
  GraduationCap,
  HardDrive,
  KeyRound,
  LockKeyhole,
  MessageSquare,
  MonitorCheck,
  Network,
  Phone,
  Radar,
  Radio,
  RotateCcw,
  ScanFace,
  Server,
  Shield,
  ShieldCheck,
  Video,
  Wifi,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState, type PointerEvent as ReactPointerEvent } from "react";
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

const capabilityIcons: Record<string, LucideIcon[]> = {
  network: [Network, Cloud, GitBranch, ShieldCheck, Activity, Wifi],
  security: [Shield, Radar, MonitorCheck, ClipboardCheck, KeyRound, GraduationCap],
  "server-storage": [Cloud, Boxes, Database, HardDrive, RotateCcw, Server],
  collaboration: [Phone, Video, MessageSquare, Radio, CircleUserRound, Bell],
  safeguarding: [Video, ScanFace, LockKeyhole, DoorOpen, ClipboardCheck, Workflow],
};

function TechnologyPartnerCard({
  categoryId,
  vendor,
}: {
  categoryId: string;
  vendor: Vendor;
}) {
  const { locale } = useI18n();
  const [logoFailed, setLogoFailed] = useState(false);

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--partner-glow-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--partner-glow-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <a
      className="solution-partner-card group relative flex min-h-72 flex-col items-center p-6 text-center md:min-h-80 md:p-8"
      data-solution-partner={vendor.name}
      href={localizedHref(vendorAnchor(categoryId, vendor.name), locale)}
      onPointerMove={handlePointerMove}
    >
      <ArrowUpRight className="absolute right-6 top-6 z-10 h-5 w-5 text-joto-green transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:right-8 md:top-8" />
      <div className="relative z-10 flex min-h-24 w-full items-center justify-center px-10">
        {vendor.logo && !logoFailed ? (
          <span className="inline-flex min-h-16 min-w-32 items-center justify-center">
            <img
              alt={`${vendor.name} logo`}
              className="max-h-12 max-w-44 object-contain opacity-80 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100"
              onError={() => setLogoFailed(true)}
              src={vendor.logo}
            />
          </span>
        ) : (
          <span className="text-xl font-semibold">{vendor.name}</span>
        )}
      </div>
      <div className="relative z-10 mt-auto flex w-full flex-col items-center pt-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(!vendor.logo || logoFailed) && (
            <h3 className="text-2xl font-medium tracking-[-0.04em]">{vendor.name}</h3>
          )}
          {vendor.tier && (
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                vendor.tier.toLowerCase() === "gold"
                  ? "border border-[#d6ad55]/70 bg-[#d6ad55]/10 text-[#e3bc68]"
                  : "border border-current/30"
              }`}
            >
              {vendor.tier} Partner
            </span>
          )}
        </div>
        <p className="mt-4 max-w-md text-center text-sm leading-6 text-white/52 transition-colors group-hover:text-white/72">
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
  if (!category) return null;

  return (
    <main
      className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased"
      data-solution-category-page={detail.id}
      id="top"
    >
      <Header />

      <section className="relative isolate min-h-[84svh] overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-28 lg:pt-40">
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
          <Reveal className="grid w-full gap-12 pt-6 lg:grid-cols-12 lg:gap-6">
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
          <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 xl:grid-cols-6">
            {detail.capabilities.map((item, index) => {
              const CapabilityIcon = capabilityIcons[detail.id]?.[index] ?? Network;

              return (
                <Reveal
                  className="flex min-h-[18rem] flex-col items-center px-2"
                  delay={index * 55}
                  key={item.title}
                >
                  <div className="flex h-20 w-full items-center justify-center">
                    <CapabilityIcon
                      aria-hidden="true"
                      className="h-12 w-12 stroke-[2.1] text-joto-green"
                    />
                  </div>
                  <div
                    className={`w-full max-w-[12rem] pt-5 ${
                      locale === "fa-IR" ? "text-right" : "text-left"
                    }`}
                  >
                    <h3 className="min-h-[4.5rem] text-xl font-medium leading-tight tracking-[-0.04em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/48">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
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
          <div className="relative mt-16 grid gap-px overflow-hidden bg-white/14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            {category.vendors.map((vendor, index) => (
              <Reveal delay={Math.min(index * 55, 220)} key={vendor.name}>
                <TechnologyPartnerCard categoryId={category.id} vendor={vendor} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
