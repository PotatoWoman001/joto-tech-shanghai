import BlogCard from "../components/BlogCard";
import InteriorPageHero from "../components/InteriorPageHero";
import SiteFooter from "../components/SiteFooter";
import { blogArticles, blogPageCopy } from "../content/blog";
import { useI18n } from "../i18n/I18nProvider";

export default function BlogPage() {
  const { locale } = useI18n();
  const copy = blogPageCopy[locale];
  const featured = blogArticles.find((article) => article.featured) ?? blogArticles[0];
  const latest = blogArticles.filter((article) => article.slug !== featured.slug);

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <InteriorPageHero
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
        titleId="blog-page-title"
      />

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="border-t border-white/15 pt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-joto-green">
            [ {copy.featured} ]
          </p>
          <div className="mt-8">
            <BlogCard article={featured} copy={copy} featured locale={locale} />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1440px]">
          <p className="border-t border-white/15 pt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/48">
            [ {copy.latest} ]
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {latest.map((article) => (
              <BlogCard article={article} copy={copy} key={article.slug} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
