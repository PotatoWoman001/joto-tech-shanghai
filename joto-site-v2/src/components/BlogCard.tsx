import { ArrowUpRight } from "lucide-react";
import type { BlogArticle, BlogPageCopy } from "../content/blog";
import { localizedHref, type Locale } from "../i18n/routing";

interface BlogCardProps {
  article: BlogArticle;
  copy: BlogPageCopy;
  featured?: boolean;
  locale: Locale;
}

export default function BlogCard({
  article,
  copy,
  featured = false,
  locale,
}: BlogCardProps) {
  const content = article.translations[locale];

  return (
    <article
      className={`group overflow-hidden border border-white/14 bg-[#08100d] ${
        featured ? "lg:grid lg:grid-cols-12" : "flex h-full flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-white/[0.03] ${
          featured ? "aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[520px]" : "aspect-[16/10]"
        }`}
      >
        <img
          alt={content.imageAlt}
          className="h-full w-full object-cover opacity-78 grayscale-[18%] transition duration-700 group-hover:scale-[1.025] group-hover:opacity-95 group-hover:grayscale-0"
          loading={featured ? "eager" : "lazy"}
          src={article.image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,11,10,0.72)_100%)]"
        />
      </div>

      <div
        className={`flex flex-1 flex-col ${
          featured ? "p-7 sm:p-9 lg:col-span-5 lg:p-10 xl:p-12" : "p-6 sm:p-7"
        }`}
      >
        <div className="flex items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-joto-green">{content.category}</span>
          <time className="text-white/38" dateTime={article.publishedAt}>
            {content.dateLabel}
          </time>
        </div>

        <h2
          className={`text-balance font-medium leading-[0.98] tracking-[-0.055em] ${
            featured ? "mt-12 text-[clamp(2.4rem,4.5vw,5.2rem)]" : "mt-9 text-[clamp(1.8rem,2.4vw,2.65rem)]"
          }`}
        >
          {content.title}
        </h2>
        <p
          className={`leading-7 text-white/55 ${
            featured ? "mt-7 max-w-xl text-base" : "mt-5 text-sm"
          }`}
        >
          {content.excerpt}
        </p>

        <a
          aria-label={`${copy.readArticle}: ${content.title}`}
          className="mt-auto inline-flex items-center justify-between gap-4 border-t border-white/14 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:text-joto-green"
          href={localizedHref(`/blog/${article.slug}`, locale)}
        >
          <span>
            {copy.readArticle} · {content.readingTime}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
}
