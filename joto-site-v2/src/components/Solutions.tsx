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

        <div className="mt-16 grid gap-x-5 gap-y-10 md:mt-24 md:grid-cols-2 xl:grid-cols-3 xl:gap-y-12">
          {solutions.categories.map((category, categoryIndex) => (
            <Reveal
              key={category.id}
              delay={categoryIndex * 70}
              className="relative min-w-0 scroll-mt-24"
            >
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
