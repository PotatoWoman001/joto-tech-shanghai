import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import Header from "./Header";
import HlsBackgroundVideo from "./HlsBackgroundVideo";
import TypewriterWords from "./TypewriterWords";

function HeroGlow() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[7%] z-[2] h-[360px] w-[min(1000px,110vw)] -translate-x-1/2 opacity-75"
      viewBox="0 0 1000 360"
    >
      <defs>
        <filter id="hero-ellipse-blur" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="25" />
        </filter>
        <linearGradient id="hero-ellipse-fill" x1="0" x2="1">
          <stop offset="0" stopColor="#0b3028" stopOpacity="0" />
          <stop offset="0.5" stopColor="#31c99a" stopOpacity="0.58" />
          <stop offset="1" stopColor="#0b3028" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        cx="500"
        cy="150"
        fill="none"
        filter="url(#hero-ellipse-blur)"
        rx="360"
        ry="62"
        stroke="url(#hero-ellipse-fill)"
        strokeWidth="30"
      />
    </svg>
  );
}

function DesktopGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {["left-1/4", "left-1/2", "left-3/4"].map((position) => (
        <span
          className={`absolute inset-y-0 w-px ${position} bg-white/10`}
          key={position}
        />
      ))}
    </div>
  );
}

interface HeroCtaProps {
  className: string;
  href: string;
  label: string;
  placement: "desktop" | "mobile";
}

function HeroCta({ className, href, label, placement }: HeroCtaProps) {
  return (
    <a
      className={`group w-fit shrink-0 items-center gap-3 rounded-full bg-joto-green px-6 py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-[#070b0a] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green ${className}`}
      data-hero-cta={placement}
      data-hero-cta-desktop={placement === "desktop" ? "true" : undefined}
      data-hero-cta-mobile={placement === "mobile" ? "true" : undefined}
      href={href}
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
        size={16}
      />
    </a>
  );
}

export default function Hero() {
  const { locale, siteContent } = useI18n();
  const { hero } = siteContent;
  const isChinese = locale === "zh-CN";
  const desktopCtaOffset = locale === "fa-IR" ? "lg:left-[32%]" : "lg:left-[47%]";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] overflow-hidden bg-[#070b0a] text-white"
    >
      <HlsBackgroundVideo
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        source={hero.videoUrl}
      />
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,#070b0a_0%,rgba(7,11,10,0.85)_24%,rgba(7,11,10,0.2)_68%,transparent_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[linear-gradient(0deg,#070b0a_0%,rgba(7,11,10,0.7)_24%,transparent_68%)]" />
      <HeroGlow />
      <DesktopGrid />
      <Header />

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1440px] items-end px-5 pb-6 pt-36 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
        <div className="w-full">
          <div className="liquid-glass mb-[-20px] h-[200px] w-[200px] translate-y-[-50px] rounded-[2px] p-5 sm:mb-[-12px] lg:absolute lg:right-[12.5%] lg:top-[20%] lg:m-0 lg:translate-y-0">
            <div className="flex h-full flex-col">
              <p className="font-sans text-[14px] font-medium tracking-[0.12em] text-white/65">
                {hero.card.tag}
              </p>
              <p className="mt-5 font-sans text-[18px] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
                {hero.card.title}{" "}
                <span className="font-serif text-[20px] font-normal italic text-joto-green">
                  {hero.card.emphasis}
                </span>
              </p>
              <p className="mt-auto font-sans text-[11px] leading-[1.45] text-white/55">
                {hero.card.description}
              </p>
            </div>
          </div>

          <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-joto-green sm:mb-5">
            {hero.eyebrow}
          </p>
          <div className="relative max-w-[1100px]" data-hero-heading-shell>
            <h1
              aria-label={`${hero.headline} ${hero.accent} ${hero.headlineSecondLine}.`}
              className="font-sans text-[clamp(1.8rem,9vw,4rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-white lg:text-[clamp(4.75rem,7.8vw,8rem)]"
              id="hero-title"
            >
              <span
                className={`block whitespace-nowrap ${isChinese ? "pl-[0.5em]" : ""}`}
                data-hero-line="primary"
              >
                {hero.headline}{" "}
                <span className="hero-accent-word inline-block font-serif font-normal italic tracking-[-0.04em] text-joto-green">
                  <TypewriterWords words={hero.accentWords} />
                </span>
              </span>
              <span
                className={`block text-white/78 ${isChinese ? "pl-[0.5em]" : "sm:pl-[0.65em]"}`}
                data-hero-line="secondary"
              >
                {hero.headlineSecondLine}
                <span className="text-joto-green">.</span>
              </span>
            </h1>
            <HeroCta
              className={`hidden lg:absolute lg:bottom-[0.08em] lg:inline-flex ${desktopCtaOffset}`}
              href={hero.cta.href}
              label={hero.cta.label}
              placement="desktop"
            />
          </div>
          <div
            className={`mt-6 sm:mt-7 ${
              isChinese
                ? "ml-[clamp(0.9rem,4.5vw,2rem)] lg:ml-[clamp(2.375rem,3.9vw,4rem)]"
                : ""
            }`}
            data-hero-support
          >
            <div
              className={`flex w-full flex-col items-center ${
                isChinese ? "max-w-[31rem]" : "max-w-[56rem]"
              }`}
              data-hero-copy-column
            >
              <p
                className="w-full font-sans text-[14px] leading-6 text-white/70 lg:text-[clamp(1.05rem,1.7vw,1.35rem)] lg:font-normal lg:leading-[1.55] lg:tracking-[-0.018em] lg:text-white/62"
                data-hero-description
              >
                {hero.description}
              </p>
              <HeroCta
                className="mt-5 inline-flex sm:mt-6 lg:hidden"
                href={hero.cta.href}
                label={hero.cta.label}
                placement="mobile"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
