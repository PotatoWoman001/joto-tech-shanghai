import { useI18n } from "../i18n/I18nProvider";
import { Reveal } from "./SectionHeading";

export default function About() {
  const { siteContent } = useI18n();
  const { about } = siteContent;

  return (
    <section id="about" className="scroll-mt-20 bg-[#070b0a] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div
          data-about-layout
          className="grid gap-12 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-10 xl:gap-16"
        >
          <Reveal className="lg:col-span-7">
            <div data-about-copy className="max-w-[48rem]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#5ed29c]">
                  04
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  {about.eyebrow}
                </p>
              </div>

              <h2 className="mt-10 max-w-[46rem] text-balance text-[clamp(2.5rem,5.25vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white lg:mt-14">
                {about.title}
              </h2>

              <p className="mt-7 max-w-[42rem] text-base leading-7 text-white/58 md:text-lg md:leading-8">
                {about.description}
              </p>

              <p className="mt-12 max-w-[40rem] text-xl leading-8 tracking-[-0.02em] text-white/78 md:mt-16 md:text-2xl md:leading-9">
                {about.secondary}
              </p>
            </div>
          </Reveal>

          <div
            data-about-stats
            className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
          >
            {about.stats.map((stat, index) => {
              const isVeryLongValue = stat.value.length > 11;
              const isLongValue = stat.value.length > 7;

              return (
                <Reveal
                  key={stat.label}
                  delay={index * 70}
                  className="h-full"
                >
                  <article
                    data-about-stat-card
                    className="group relative flex min-h-[8.75rem] h-full min-w-0 flex-col justify-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#090e0c] px-6 py-7 transition-colors duration-300 hover:border-[#5ed29c]/45 sm:px-7 lg:min-h-[9.5rem] lg:px-8"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#5ed29c]/[0.06] blur-3xl transition-colors duration-300 group-hover:bg-[#5ed29c]/[0.11]"
                    />
                    <p className="relative text-sm leading-6 text-white/46 md:text-base">
                      {stat.label}
                    </p>
                    <p
                      className={`relative mt-2 min-w-0 whitespace-nowrap font-medium leading-none tracking-[-0.055em] text-[#5ed29c] ${
                        isVeryLongValue
                          ? "text-[clamp(1.6rem,3vw,3.15rem)]"
                          : isLongValue
                            ? "text-[clamp(1.85rem,3.4vw,3.6rem)]"
                            : "text-[clamp(2.8rem,4.8vw,4.5rem)]"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
