import { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { Vendor } from "../content/types";
import SectionHeading, { Reveal } from "./SectionHeading";

const logoScaleClasses: Record<NonNullable<Vendor["logoScale"]>, string> = {
  compact: "max-h-10 max-w-[5rem] sm:max-h-12 sm:max-w-[8.5rem]",
  standard: "max-h-8 max-w-[5.5rem] sm:max-h-10 sm:max-w-[10rem]",
  wide: "max-h-7 max-w-[5.75rem] sm:max-h-9 sm:max-w-[11rem]",
};

function PartnerLogoCard({ partner }: { partner: Vendor }) {
  const [failed, setFailed] = useState(false);
  const scale = partner.logoScale ?? "standard";

  return (
    <div
      className="group flex h-20 items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-[#f2f4f3] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white sm:h-24 sm:px-4 md:h-28 md:px-5"
      data-partner-logo-card
    >
      {partner.logo && !failed ? (
        <img
          alt={`${partner.name} logo`}
          className={`${logoScaleClasses[scale]} w-auto object-contain opacity-90 transition-[opacity,transform] duration-300 group-hover:scale-[1.025] group-hover:opacity-100`}
          data-logo-scale={scale}
          decoding="async"
          loading="eager"
          onError={() => setFailed(true)}
          src={partner.logo}
        />
      ) : (
        <span className="text-center text-sm font-semibold text-[#17201d]">{partner.name}</span>
      )}
    </div>
  );
}

export default function Partners() {
  const { siteContent } = useI18n();
  const { partners } = siteContent;

  return (
    <section id="partners" className="bg-[#090e0d] px-5 py-20 sm:px-8 sm:py-24 md:py-28 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="05"
          eyebrow={partners.eyebrow}
          title={partners.title}
          description={partners.description}
        />

        <div
          className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:mt-14 lg:grid-cols-4 xl:grid-cols-5"
          data-partner-logo-grid
        >
          {partners.items.map((partner, index) => (
            <Reveal key={partner.name} delay={(index % 5) * 45}>
              <PartnerLogoCard partner={partner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
