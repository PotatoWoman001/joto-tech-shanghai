import { useI18n } from "../i18n/I18nProvider";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function About() {
  const { siteContent } = useI18n();
  const { about } = siteContent;

  return (
    <section id="about" className="scroll-mt-20 bg-[#070b0a] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="04"
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5 lg:col-start-5">
            <p className="text-xl leading-8 tracking-[-0.02em] text-white/76 md:text-2xl md:leading-9">
              {about.secondary}
            </p>
          </Reveal>
          <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:col-span-12 lg:mt-16 lg:grid-cols-4">
            {about.stats.map((stat, index) => {
              const isLongValue = stat.value.length > 7;
              const keepOnOneLine = stat.value === "MULTI-VENDOR";

              return (
                <Reveal
                  key={stat.label}
                  delay={index * 70}
                  className="min-h-48 min-w-0 overflow-hidden border-b border-r border-white/15 p-6 sm:min-h-56 lg:p-8"
                >
                  <p
                    className={`min-w-0 break-words font-medium leading-[0.96] tracking-[-0.06em] text-[#5ed29c] [overflow-wrap:anywhere] ${
                      keepOnOneLine
                        ? "whitespace-nowrap text-[clamp(1.25rem,2.35vw,2.4rem)] tracking-[-0.07em]"
                        : isLongValue
                        ? "text-[clamp(1.65rem,2.8vw,2.75rem)]"
                        : "text-[clamp(2.75rem,5vw,5rem)]"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-12 max-w-[14rem] break-words text-xs uppercase leading-5 tracking-[0.17em] text-white/48">
                    {stat.label}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
