import { ArrowRight } from "lucide-react";
import type { SolutionCategory } from "../content/types";
import { localizedHref, type Locale } from "../i18n/routing";
import { vendorAnchor } from "../lib/anchors";

interface SolutionCardProps {
  category: SolutionCategory;
  index: number;
  learnMoreLabel: string;
  locale: Locale;
}

export default function SolutionCard({
  category,
  index,
  learnMoreLabel,
  locale,
}: SolutionCardProps) {
  const primaryVendor = category.vendors[0];
  const href = localizedHref(
    primaryVendor ? vendorAnchor(category.id, primaryVendor.name) : "/contact",
    locale,
  );

  return (
    <article
      className="group relative h-[620px] min-w-0 sm:h-[680px] xl:h-[660px]"
      data-solution-card={category.id}
    >
      <div
        className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-[1.6rem] bg-[#111714] transition-[height] duration-500 ease-out group-focus-within:h-full xl:h-[550px] xl:group-hover:h-full motion-reduce:transition-none"
        data-solution-visual
      >
        <img
          alt={category.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-focus-within:scale-[1.03] xl:group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          loading="lazy"
          src={category.image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 transition-colors duration-500 xl:from-black/70 xl:via-transparent xl:group-hover:from-black/90 xl:group-hover:via-black/25 group-focus-within:from-black/90 group-focus-within:via-black/25 motion-reduce:transition-none"
        />

        <span className="absolute left-6 top-6 rounded-full border border-white/35 bg-black/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/75 backdrop-blur-sm sm:left-7 sm:top-7">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-28 px-6 transition-[bottom] duration-500 ease-out sm:px-7 xl:bottom-6 xl:group-hover:bottom-28 group-focus-within:bottom-28 motion-reduce:transition-none">
          <h3 className="text-balance text-[clamp(2rem,3vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
            {category.title}
          </h3>
          <p
            className="mt-4 max-w-md text-sm leading-6 text-white/78 transition-[max-height,opacity,transform] duration-500 ease-out xl:max-h-0 xl:translate-y-3 xl:overflow-hidden xl:opacity-0 xl:group-hover:max-h-24 xl:group-hover:translate-y-0 xl:group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
            data-solution-description
          >
            {category.description}
          </p>
        </div>
      </div>

      <a
        aria-label={`${learnMoreLabel}: ${category.title}`}
        className="absolute bottom-6 left-6 right-6 flex h-[72px] items-center justify-between rounded-full border border-black bg-black px-7 text-base font-semibold text-white transition-[bottom,background-color,border-color,color] duration-500 ease-out hover:text-joto-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green xl:bottom-0 xl:group-hover:bottom-6 xl:group-hover:border-white xl:group-hover:bg-white xl:group-hover:text-joto-green group-focus-within:bottom-6 group-focus-within:border-white group-focus-within:bg-white group-focus-within:text-joto-green motion-reduce:transition-none"
        href={href}
      >
        <span>{learnMoreLabel}</span>
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
        />
      </a>
    </article>
  );
}
