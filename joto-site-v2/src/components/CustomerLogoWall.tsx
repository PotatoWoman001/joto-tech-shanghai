import { useState, type CSSProperties } from "react";
import { customerLogoRows, type CustomerLogo } from "../content/customerLogos";

interface LogoCardProps {
  decorative: boolean;
  logo: CustomerLogo;
}

function LogoCard({ decorative, logo }: LogoCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <li
      aria-hidden={decorative || undefined}
      className="group flex h-[4.5rem] w-48 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#f4f6f5] px-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:h-20 sm:w-56 sm:px-6"
    >
      {failed ? (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#17211e]/70">
          {logo.name}
        </span>
      ) : (
        <img
          alt={decorative ? "" : `${logo.name} logo`}
          className="max-h-10 w-auto max-w-[9.5rem] object-contain opacity-70 grayscale brightness-50 transition-[filter,opacity,transform] duration-300 group-hover:scale-[1.02] group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-75 sm:max-h-11 sm:max-w-[11rem]"
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
        <LogoCard decorative={decorative} key={logo.name} logo={logo} />
      ))}
    </ul>
  );
}

export default function CustomerLogoWall() {
  return (
    <section
      aria-labelledby="customer-logo-wall-title"
      className="customer-logo-wall relative overflow-hidden bg-[#070b0a] py-16 text-white sm:py-20"
      id="customer-logo-wall"
    >
      <div className="mx-auto mb-9 max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#5ed29c]">
          CUSTOMER ECOSYSTEM
        </p>
        <h2
          className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-white/82 sm:text-2xl"
          id="customer-logo-wall-title"
        >
          TRUSTED BY INDUSTRY LEADERS
        </h2>
      </div>

      <div className="space-y-3">
        {customerLogoRows.map((logos, rowIndex) => (
          <div
            aria-label={`Customer logos row ${rowIndex + 1}`}
            className="customer-logo-wall__viewport overflow-hidden"
            key={`logo-row-${rowIndex + 1}`}
            role="group"
          >
            <div
              className={`customer-logo-wall__track flex w-max ${
                rowIndex === 1 ? "customer-logo-wall__track--reverse" : ""
              }`}
              style={{ "--logo-wall-duration": rowIndex === 0 ? "46s" : "52s" } as CSSProperties}
            >
              <LogoSequence decorative={false} logos={logos} />
              <LogoSequence decorative logos={logos} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
