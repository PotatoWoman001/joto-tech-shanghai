import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function CaseStudies() {
  const { siteContent } = useI18n();
  const { caseStudies } = siteContent;

  return (
    <section id="case-studies" className="scroll-mt-20 bg-[#090e0d] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="03"
          eyebrow={caseStudies.eyebrow}
          title={caseStudies.title}
          description={caseStudies.description}
        />

        <div className="mt-12 grid gap-2 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {caseStudies.items.map((item, index) => (
            <Reveal
              key={item.client}
              delay={index * 90}
              className="group flex min-h-[268px] flex-col rounded-[13px] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.026),transparent_48%)] bg-[#0a100e] p-3.5 transition-colors duration-500 hover:bg-[#0d1512]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="max-w-[78%] break-words text-[9px] uppercase tracking-[0.15em] text-white/45">
                  {item.sector}
                </span>
                <ArrowUpRight className="h-[17px] w-[17px] shrink-0 text-[#5ed29c] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center justify-center pb-1 pt-2.5 text-center">
                {item.logo ? (
                  <div className="flex h-[86px] w-full min-w-0 items-center justify-center">
                    <img
                      src={item.logo}
                      alt={`${item.client} logo`}
                      loading="lazy"
                      className={`h-auto w-auto object-contain object-center ${
                        index === 0
                          ? "max-h-[85px] max-w-[85px]"
                          : index === 1
                            ? "max-h-[70px] max-w-[137px]"
                          : "max-h-[78px] max-w-[152px]"
                      } ${
                        item.logoTreatment === "original" ? "" : "brightness-0 invert"
                      }`}
                    />
                  </div>
                ) : (
                  <p className="flex h-[86px] items-center text-sm font-semibold uppercase tracking-[0.22em] text-[#5ed29c]">
                    {item.client}
                  </p>
                )}
                <h3 className="mt-3.5 max-w-[235px] break-words text-[13px] font-medium leading-[1.4] tracking-[-0.02em] text-white/90">
                  {item.summary}
                </h3>
                <ul
                  className="mt-3 flex flex-wrap justify-center gap-1.5"
                  aria-label={`${item.client} capabilities`}
                >
                  {item.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="max-w-full break-words rounded-full border border-white/12 px-1.5 py-0.5 text-[8px] text-white/50"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
