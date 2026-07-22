import { siteContent } from "../content/en";
import { vendorAnchor } from "../lib/anchors";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function Solutions() {
  const { solutions } = siteContent;

  return (
    <section id="solutions" className="scroll-mt-20 bg-[#070b0a] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="01"
          eyebrow={solutions.eyebrow}
          title={solutions.title}
          description={solutions.description}
        />

        <div className="mt-16 grid border-l border-t border-white/15 md:mt-24 md:grid-cols-2 lg:grid-cols-5">
          {solutions.categories.map((category, categoryIndex) => (
            <Reveal
              key={category.id}
              delay={categoryIndex * 70}
              className={`group relative flex min-h-[390px] min-w-0 flex-col overflow-hidden border-b border-r border-white/15 bg-white/[0.015] p-5 transition-colors duration-500 hover:bg-white/[0.045] sm:p-6 lg:min-h-[410px] lg:p-5 2xl:p-7 ${
                categoryIndex === solutions.categories.length - 1
                  ? "md:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              {category.vendors.map((vendor) => (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 scroll-mt-24"
                  id={vendorAnchor(category.id, vendor.name).slice(1)}
                  key={vendor.name}
                />
              ))}
              <div className="flex scroll-mt-24 items-center justify-between" id={`solution-${category.id}`}>
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#5ed29c] shadow-[0_0_18px_rgba(94,210,156,0.65)]" />
              </div>

              <div
                className={`mt-8 overflow-hidden border border-white/10 bg-[#0b1210] ${
                  categoryIndex === solutions.categories.length - 1
                    ? "aspect-[16/10] md:aspect-[16/6] lg:aspect-[16/10]"
                    : "aspect-[16/10]"
                }`}
              >
                <img
                  src={category.image}
                  alt={category.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100 motion-reduce:transition-none"
                />
              </div>

              <h3 className="mt-7 break-words text-[clamp(1.25rem,1.75vw,1.5rem)] font-medium tracking-[-0.03em] text-white">
                {category.title}
              </h3>
              <p className="mt-4 break-words text-sm leading-6 text-white/52">
                {category.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
