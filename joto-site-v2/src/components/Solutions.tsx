import { siteContent } from "../content/en";
import { vendorAnchor } from "../lib/anchors";
import SectionHeading, { Reveal } from "./SectionHeading";

function Tier({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-[#5ed29c]/45 bg-[#5ed29c]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8ce8ba]">
      {value}
    </span>
  );
}

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

        <div className="mt-16 grid border-l border-t border-white/15 md:mt-24 md:grid-cols-2 xl:grid-cols-5">
          {solutions.categories.map((category, categoryIndex) => (
            <Reveal
              key={category.id}
              delay={categoryIndex * 70}
              className="group flex min-h-[390px] flex-col border-b border-r border-white/15 bg-white/[0.015] p-6 transition-colors duration-500 hover:bg-white/[0.045] md:min-h-[430px] lg:p-7"
            >
              <div className="flex scroll-mt-24 items-center justify-between" id={`solution-${category.id}`}>
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#5ed29c] shadow-[0_0_18px_rgba(94,210,156,0.65)]" />
              </div>
              <h3 className="mt-12 text-2xl font-medium tracking-[-0.03em] text-white">
                {category.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/52">{category.description}</p>
              <div className="mt-auto space-y-1 pt-10">
                {category.vendors.map((vendor) => (
                  <div
                    id={vendorAnchor(category.id, vendor.name).slice(1)}
                    key={vendor.name}
                    className="flex min-h-11 scroll-mt-24 items-center justify-between gap-3 border-t border-white/10 py-2.5"
                  >
                    <span className="text-[13px] font-medium text-white/82">{vendor.name}</span>
                    {vendor.tier && <Tier value={vendor.tier} />}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
