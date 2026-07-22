import { type ReactNode, useEffect, useRef, useState } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    if (!("IntersectionObserver" in window) || !ref.current) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transform-gpu transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  index,
}: SectionHeadingProps) {
  return (
    <Reveal className="grid gap-8 border-t border-white/15 pt-6 md:grid-cols-12 md:gap-6">
      <div className="flex items-center gap-3 md:col-span-4">
        {index && (
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#5ed29c]">
            {index}
          </span>
        )}
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          {eyebrow}
        </p>
      </div>
      <div className="md:col-span-8">
        <h2 className="max-w-4xl text-balance text-[clamp(2.25rem,5.5vw,5.75rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/58 md:text-lg md:leading-8">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
