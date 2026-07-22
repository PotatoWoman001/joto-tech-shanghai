import { siteContent } from "../content/en";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function Partners() {
  const { partners } = siteContent;

  return (
    <section id="partners" className="bg-[#090e0d] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="05"
          eyebrow={partners.eyebrow}
          title={partners.title}
          description={partners.description}
        />

        <div className="mt-16 grid border-l border-t border-white/15 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {partners.items.map((partner, index) => (
            <Reveal
              key={partner.name}
              delay={(index % 4) * 55}
              className="group relative flex min-h-40 flex-col justify-between border-b border-r border-white/15 p-5 transition-colors duration-500 hover:bg-white/[0.035] sm:min-h-44 lg:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    loading="lazy"
                    className="h-8 w-auto max-w-[150px] object-contain object-left brightness-0 invert opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  />
                ) : (
                  <span className="text-sm font-semibold text-white/85">{partner.name}</span>
                )}
                {partner.tier && (
                  <span className="shrink-0 rounded-full border border-[#5ed29c]/40 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#7ee2af]">
                    {partner.tier}
                  </span>
                )}
              </div>
              <div>
                {partner.logo && <p className="text-xs font-medium text-white/75">{partner.name}</p>}
                <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/38">
                  {partner.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
