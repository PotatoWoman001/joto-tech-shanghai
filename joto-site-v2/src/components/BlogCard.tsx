import { ArrowUpRight } from "lucide-react";
import type { BlogArticle, BlogPageCopy } from "../content/blog";
import { localizedHref, type Locale } from "../i18n/routing";

interface BlogCardProps {
  article: BlogArticle;
  copy: BlogPageCopy;
  locale: Locale;
}

export default function BlogCard({ article, copy, locale }: BlogCardProps) {
  const content = article.translations[locale];

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/14 bg-[#08100d]">
      <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.03]">
        <img
          alt={content.imageAlt}
          className="h-full w-full object-cover opacity-80 grayscale-[12%] transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100 group-hover:grayscale-0"
          loading={article.featured ? "eager" : "lazy"}
          src={article.image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,11,10,0.72)_100%)]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-joto-green">{content.category}</span>
          <time className="text-white/38" dateTime={article.publishedAt}>
            {content.dateLabel}
          </time>
        </div>

        <h2 className="mt-7 text-balance text-[clamp(1.65rem,2.15vw,2.3rem)] font-medium leading-[1.02] tracking-[-0.05em]">
          {content.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/55">
          {content.excerpt}
        </p>

        <a
          aria-label={`${copy.readArticle}: ${content.title}`}
          className="mt-6 inline-flex items-center justify-between gap-4 border-t border-white/14 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:text-joto-green"
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
