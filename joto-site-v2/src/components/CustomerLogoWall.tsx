import { useState, type CSSProperties } from "react";
import {
  customerLogoRows,
  type CustomerLogo,
  type CustomerLogoScale,
} from "../content/customerLogos";
import { useI18n } from "../i18n/I18nProvider";

const logoScaleClasses: Record<CustomerLogoScale, string> = {
  compact: "max-h-12 max-w-[7rem] sm:max-h-14 sm:max-w-[8rem]",
  standard: "max-h-10 max-w-[9.5rem] sm:max-h-12 sm:max-w-[11rem]",
  prominent: "max-h-9 max-w-[10.5rem] sm:max-h-11 sm:max-w-[12rem]",
};

const customerLogos = customerLogoRows.flat();

interface LogoItemProps {
  decorative: boolean;
  logo: CustomerLogo;
}

function LogoItem({ decorative, logo }: LogoItemProps) {
  const [failed, setFailed] = useState(false);
  const scale = logo.scale ?? "standard";

  return (
    <li
      aria-hidden={decorative || undefined}
      className="customer-logo-wall__item group flex h-36 w-40 shrink-0 items-center justify-center px-4 sm:h-44 sm:w-48 sm:px-5"
      data-customer-logo-item
    >
      {failed ? (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e7efec]/80">
          {logo.name}
        </span>
      ) : (
        <img
          alt={decorative ? "" : `${logo.name} logo`}
          className={`${logoScaleClasses[scale]} customer-logo-wall__logo w-auto object-contain`}
          data-logo-scale={scale}
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
      className="flex shrink-0 gap-3 pr-3"
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
      className="customer-logo-wall relative overflow-hidden bg-[#070b0a] py-14 text-white sm:py-18"
      id="customer-logo-wall"
    >
      <div className="mx-auto mb-7 max-w-[1440px] px-5 text-center sm:mb-9 sm:px-8 lg:px-12">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#5ed29c]">
          {t("CUSTOMER ECOSYSTEM")}
        </p>
        <h2
          className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-white/82 sm:text-2xl"
          id="customer-logo-wall-title"
        >
          {t("TRUSTED BY INDUSTRY LEADERS")}
        </h2>
      </div>

      <div className="customer-logo-wall__ribbon relative border-y border-white/10 bg-[#0a1210]/80">
        <div
          aria-label={`${t("Customer logos row")} 1`}
          className="customer-logo-wall__viewport overflow-hidden"
          role="group"
        >
          <div
            className="customer-logo-wall__track flex w-max"
            style={{ "--logo-wall-duration": "132s" } as CSSProperties}
          >
            <LogoSequence decorative={false} logos={customerLogos} />
            <LogoSequence decorative logos={customerLogos} />
          </div>
        </div>
      </div>
    </section>
  );
}
