import { Check } from "lucide-react";
import { siteContent } from "../content/en";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function Services() {
  const { services } = siteContent;

  return (
    <section id="services" className="scroll-mt-20 bg-[#070b0a] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="02"
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-white/15 bg-white/15 md:mt-24 md:grid-cols-2">
          {services.items.map((service, index) => (
            <Reveal
              key={service.title}
              delay={index * 80}
              className="group relative flex min-h-[380px] flex-col bg-[#070b0a] p-7 transition-colors duration-500 hover:bg-[#0c1311] sm:p-10 lg:min-h-[440px] lg:p-12"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#5ed29c]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(120px,34%)] lg:items-start lg:gap-8">
                <div className="min-w-0">
                  <h3 className="max-w-md text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/52">
                    {service.description}
                  </p>
                </div>

                <div className="relative h-24 overflow-hidden border border-white/12 sm:h-28 lg:aspect-[3/2] lg:h-auto lg:w-full lg:max-w-[220px] lg:justify-self-end">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover brightness-[0.72] saturate-[0.72] transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(7,11,10,0.04),rgba(49,201,154,0.16))]"
                  />
                </div>
              </div>

              <ul className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-xs leading-5 text-white/65">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5ed29c]" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
