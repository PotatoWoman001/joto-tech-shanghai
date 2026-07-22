import { ArrowRight } from "lucide-react";
import { siteContent } from "../content/en";
import Header from "./Header";
import HlsBackgroundVideo from "./HlsBackgroundVideo";

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

export default function Hero() {
  const { hero } = siteContent;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-[#070b0a] text-white"
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

      <div className="absolute inset-x-0 top-[24%] z-20 hidden lg:block">
        <div className="mx-auto w-full max-w-[1440px] px-12">
          <p className="max-w-[720px] text-[clamp(2rem,3vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.035em] text-white/72">
            {hero.description}
          </p>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[1440px] items-end px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="w-full">
          <div className="liquid-glass mb-[-20px] h-[200px] w-[200px] translate-y-[-50px] rounded-[2px] p-5 sm:mb-[-12px] lg:ml-auto lg:mr-[8.5%]">
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
          <h1
            className="max-w-[1020px] font-sans text-[40px] font-extrabold uppercase leading-[0.94] tracking-[-0.055em] text-white sm:text-[54px] lg:text-[72px]"
            id="hero-title"
          >
            {hero.headline}
            <span className="text-joto-green">{hero.accent}</span>
          </h1>
          <div className="mt-6 flex max-w-[960px] flex-col gap-7 sm:mt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg font-sans text-[14px] leading-6 text-white/70 lg:hidden">
              {hero.description}
            </p>
            <a
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-joto-green px-6 py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-[#070b0a] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green lg:ml-auto"
              href={hero.cta.href}
            >
              {hero.cta.label}
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
                size={16}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
