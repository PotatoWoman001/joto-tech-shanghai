import { useI18n } from "../i18n/I18nProvider";
import { vendorId } from "../lib/anchors";
import SectionHeading, { Reveal } from "./SectionHeading";
import SolutionCard from "./SolutionCard";

export default function Solutions() {
  const { locale, siteContent, t } = useI18n();
  const { solutions } = siteContent;

  return (
    <section id="solutions" className="scroll-mt-20 bg-[#070b0a] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="01"
          eyebrow={solutions.eyebrow}
          title={solutions.title}
          description={solutions.description}
        />

        <div
          aria-label={solutions.eyebrow}
          className="solution-card-scroller mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 md:mt-24"
          data-solutions-scroller
          role="region"
          tabIndex={0}
        >
          {solutions.categories.map((category, categoryIndex) => (
            <Reveal
              key={category.id}
              delay={categoryIndex * 70}
              className="relative w-[82vw] max-w-[420px] flex-none snap-start scroll-mt-24 sm:w-[48vw] lg:w-[31vw] xl:w-[420px]"
            >
              <span data-solution-card-slot />
              {category.vendors.map((vendor) => (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 scroll-mt-24"
                  id={vendorId(category.id, vendor.name)}
                  key={vendor.name}
                />
              ))}
              <div id={`solution-${category.id}`}>
                <SolutionCard
                  category={category}
                  index={categoryIndex}
                  learnMoreLabel={t("Learn more")}
                  locale={locale}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
