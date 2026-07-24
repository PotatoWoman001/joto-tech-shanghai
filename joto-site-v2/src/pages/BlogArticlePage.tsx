import { ArrowLeft } from "lucide-react";
import BlogCard from "../components/BlogCard";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import {
  blogArticles,
  blogPageCopy,
  type BlogArticle,
  type BlogBodyBlock,
} from "../content/blog";
import { useI18n } from "../i18n/I18nProvider";
import { localizedHref } from "../i18n/routing";

function ArticleBodyBlock({
  block,
  viewpointLabel,
}: {
  block: BlogBodyBlock;
  viewpointLabel: string;
}) {
  if (block.type === "heading") {
    return (
      <h2 className="pt-7 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1] tracking-[-0.055em] text-white">
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="space-y-4 border-l border-joto-green/55 pl-6 text-base leading-8 text-white/68 md:text-lg">
        {block.items.map((item) => (
          <li className="relative before:absolute before:-left-[1.55rem] before:top-[0.85rem] before:h-1.5 before:w-1.5 before:bg-joto-green" key={item}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    return (
      <aside
        className="relative my-10 overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(94,210,156,0.09),transparent_38%)] py-7 sm:my-12 sm:py-9"
        data-article-closing-viewpoint
      >
        <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-joto-green">
          <span aria-hidden="true" className="h-px w-8 bg-joto-green" />
          {viewpointLabel}
        </p>
        <blockquote className="max-w-3xl border-s-2 border-joto-green ps-5 font-sans text-[clamp(1.55rem,3vw,2.65rem)] font-medium not-italic leading-[1.18] tracking-[-0.035em] text-white/88 sm:ps-7">
          {block.text}
        </blockquote>
      </aside>
    );
  }

  return <p className="text-base leading-8 text-white/68 md:text-lg md:leading-9">{block.text}</p>;
}

export default function BlogArticlePage({ article }: { article?: BlogArticle }) {
  const { locale } = useI18n();
  const copy = blogPageCopy[locale];

  if (!article) {
    return (
      <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
        <Header />
        <section className="flex min-h-[72svh] items-end px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">
          <div className="mx-auto w-full max-w-[1440px] border-t border-white/15 pt-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-joto-green">
              [ {copy.notFoundEyebrow} ]
            </p>
            <h1 className="mt-12 max-w-5xl text-[clamp(3.8rem,9vw,9rem)] font-medium leading-[0.86] tracking-[-0.075em]">
              {copy.notFoundTitle}
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/55">
              {copy.notFoundDescription}
            </p>
            <a
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-joto-green/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-joto-green hover:text-joto-ink"
              href={localizedHref("/blog", locale)}
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToInsights}
            </a>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  const content = article.translations[locale];
  const related = blogArticles.filter(({ slug }) => slug !== article.slug).slice(0, 2);

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Header />

      <header className="relative overflow-hidden border-b border-white/10 px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(94,210,156,0.13),transparent_32%)]"
        />
        <div className="relative mx-auto max-w-[1440px]">
          <a
            className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48 transition-colors hover:text-joto-green"
            href={localizedHref("/blog", locale)}
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backToInsights}
          </a>

          <div className="mt-12 grid gap-10 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-joto-green">
                [ {content.category} ]
              </p>
              <p className="mt-5 text-xs leading-6 text-white/42">
                <time dateTime={article.publishedAt}>{content.dateLabel}</time>
                <br />
                {content.readingTime}
              </p>
            </div>
            <div className="lg:col-span-9">
              <h1
                className={`max-w-6xl text-balance text-[clamp(3.4rem,7.6vw,8.2rem)] font-medium tracking-[-0.072em] ${
                  locale === "en" ? "leading-[1.04]" : "leading-[0.87]"
                }`}
              >
                {content.title}
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/58 md:text-xl md:leading-9">
                {content.excerpt}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <figure className="mx-auto max-w-[1440px] overflow-hidden border border-white/14 bg-[#08100d]">
          <img
            alt={content.imageAlt}
            className="aspect-[16/8] w-full object-cover opacity-88"
            src={article.image}
          />
        </figure>
      </div>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-6">
          <aside className="lg:col-span-3">
            <div className="border-t border-white/15 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/38 lg:sticky lg:top-28">
              JOTO TECH
              <br />
              {content.category}
            </div>
          </aside>
          <article className="space-y-8 lg:col-span-7">
            {content.body.map((block, index) => (
              <ArticleBodyBlock
                block={block}
                key={`${block.type}-${index}`}
                viewpointLabel={copy.viewpointLabel}
              />
            ))}
          </article>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-joto-green">
            [ {copy.related} ]
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {related.map((relatedArticle) => (
              <BlogCard
                article={relatedArticle}
                copy={copy}
                key={relatedArticle.slug}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
