import { ArrowUpRight } from "lucide-react";
import { siteContent } from "../content/en";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function CaseStudies() {
  const { caseStudies } = siteContent;

  return (
    <section id="case-studies" className="scroll-mt-20 bg-[#090e0d] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="03"
          eyebrow={caseStudies.eyebrow}
          title={caseStudies.title}
          description={caseStudies.description}
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-white/15 bg-white/15 md:mt-24 lg:grid-cols-2">
          {caseStudies.items.map((item, index) => (
            <Reveal
              key={item.client}
              delay={index * 90}
              className="group flex min-h-[420px] flex-col bg-[#090e0d] p-7 transition-colors duration-500 hover:bg-[#0d1512] sm:p-9 lg:min-h-[500px] lg:p-12"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="max-w-[75%] break-words rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {item.sector}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[#5ed29c] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" />
              </div>

              <div className="mt-auto min-w-0">
                {item.logo ? (
                  <div className="mb-8 flex h-24 min-w-0 items-end sm:h-28">
                    <img
                      src={item.logo}
                      alt={`${item.client} logo`}
                      loading="lazy"
                      className="max-h-20 w-auto max-w-full object-contain object-left brightness-0 invert sm:max-h-24 sm:max-w-[260px]"
                    />
                  </div>
                ) : (
                  <p className="mb-8 text-sm font-semibold uppercase tracking-[0.22em] text-[#5ed29c]">
                    {item.client}
                  </p>
                )}
                <h3 className="max-w-xl break-words text-2xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-3xl">
                  {item.summary}
                </h3>
                <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${item.client} capabilities`}>
                  {item.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/62"
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
