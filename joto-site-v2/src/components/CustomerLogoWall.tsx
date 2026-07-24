import { useState, type CSSProperties } from "react";
import {
  customerLogoRows,
  type CustomerLogo,
  type CustomerLogoScale,
} from "../content/customerLogos";
import { useI18n } from "../i18n/I18nProvider";

const logoScaleClasses: Record<CustomerLogoScale, string> = {
  compact: "h-9 w-24 sm:h-11 sm:w-28",
  standard: "h-8 w-32 sm:h-10 sm:w-40",
  prominent: "h-8 w-36 sm:h-10 sm:w-44",
};

const customerLogos = customerLogoRows.flat();

interface LogoItemProps {
  decorative: boolean;
  logo: CustomerLogo;
}

function LogoItem({ decorative, logo }: LogoItemProps) {
  const [failed, setFailed] = useState(false);
  const scale = logo.scale ?? "standard";
  const treatment = logo.treatment ?? "solid";

  return (
    <li
      aria-hidden={decorative || undefined}
      className="customer-logo-wall__item group flex h-20 shrink-0 items-center justify-center sm:h-24"
      data-customer-logo-item
    >
      {failed ? (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e7efec]/80">
          {logo.name}
        </span>
      ) : (
        <img
          alt={decorative ? "" : `${logo.name} logo`}
          className={`${logoScaleClasses[scale]} customer-logo-wall__logo ${
            treatment === "contrast" ? "customer-logo-wall__logo--contrast" : ""
          } object-contain`}
          data-logo-scale={scale}
          data-logo-treatment={treatment}
          decoding="async"
          onError={() => setFailed(true)}
          src={logo.src}
        />
      )}
    </li>
  );
}

interface LogoSequenceProps {
  decorative: boolean;
  logos: readonly CustomerLogo[];
}

function LogoSequence({ decorative, logos }: LogoSequenceProps) {
  return (
    <ul
      aria-hidden={decorative || undefined}
      className="flex shrink-0 items-center gap-16 pr-16 sm:gap-24 sm:pr-24 lg:gap-28 lg:pr-28"
      data-logo-sequence={decorative ? "duplicate" : "primary"}
    >
      {logos.map((logo) => (
        <LogoItem decorative={decorative} key={logo.name} logo={logo} />
      ))}
    </ul>
  );
}

export default function CustomerLogoWall() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="customer-logo-wall-title"
      className="customer-logo-wall relative overflow-hidden py-14 text-white sm:py-18"
      id="customer-logo-wall"
    >
      <div className="mx-auto mb-7 max-w-[1440px] px-5 text-center sm:mb-10 sm:px-8 lg:px-12">
        <h2
          className="text-2xl font-medium tracking-[-0.035em] text-white/88 sm:text-3xl"
          id="customer-logo-wall-title"
        >
          {t("TRUSTED BY INDUSTRY LEADERS")}
        </h2>
      </div>

      <div
        aria-label={`${t("Customer logos row")} 1`}
        className="customer-logo-wall__viewport overflow-hidden"
        data-logo-marquee
        role="group"
      >
        <div
          className="customer-logo-wall__track flex w-max"
          style={{ "--logo-wall-duration": "108s" } as CSSProperties}
        >
          <LogoSequence decorative={false} logos={customerLogos} />
          <LogoSequence decorative logos={customerLogos} />
        </div>
      </div>
    </section>
  );
}
