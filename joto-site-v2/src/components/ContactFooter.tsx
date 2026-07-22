import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { siteContent } from "../content/en";
import { Reveal } from "./SectionHeading";

function telephoneHref(value: string) {
  return `tel:${value.replace(/[^+\d]/g, "")}`;
}

export default function ContactFooter() {
  const { brand, contact, footer } = siteContent;

  return (
    <>
      <section id="contact" className="scroll-mt-20 bg-[#5ed29c] px-5 py-24 text-[#07100c] sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-black/25 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] lg:col-span-4">
              {contact.eyebrow}
            </p>
            <div className="lg:col-span-8">
              <h2 className="max-w-5xl text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.88] tracking-[-0.07em]">
                {contact.title}
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-black/65 md:text-lg">
                {contact.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid border-l border-t border-black/25 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            <a
              href={`mailto:${contact.email}`}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <div className="flex items-center justify-between">
                <Mail className="h-5 w-5" />
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Email</p>
                <p className="mt-2 break-all text-sm font-semibold">{contact.email}</p>
              </div>
            </a>
            <a
              href={telephoneHref(contact.phone)}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <Phone className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Shanghai</p>
                <p className="mt-2 text-sm font-semibold">{contact.phone}</p>
              </div>
            </a>
            <a
              href={telephoneHref(contact.hotline)}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <Phone className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Service hotline</p>
                <p className="mt-2 text-sm font-semibold">{contact.hotline}</p>
              </div>
            </a>
            <a
              href="#top"
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <ArrowUpRight className="h-5 w-5 rotate-[-45deg] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Back to top</p>
                <p className="mt-2 text-sm font-semibold">Explore JOTO TECH</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#050807] px-5 pb-8 pt-20 text-white sm:px-8 lg:px-12 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <a href="#top" className="text-2xl font-semibold tracking-[-0.04em]">
                {brand.name}
              </a>
              <p className="mt-4 text-sm text-white/42">We Make IT Happen.</p>
            </div>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 lg:col-span-3">
              {footer.links.map((link) => (
                <a key={link.href} href={link.href} className="text-xs text-white/55 transition-colors hover:text-[#5ed29c]">
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              {contact.offices.slice(0, 2).map((office) => (
                <address key={office.city} className="not-italic">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#5ed29c]">{office.city}</p>
                  <p className="mt-2 text-xs leading-5 text-white/48">{office.address}</p>
                </address>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col gap-3 border-t border-white/12 pt-6 text-[10px] uppercase tracking-[0.14em] text-white/32 sm:flex-row sm:items-center sm:justify-between">
            <p>{footer.copyright}</p>
            <p>{contact.companyEn}</p>
            <p>{footer.icp}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
