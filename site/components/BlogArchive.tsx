import { POSTS } from '@/lib/blog';

// Rendered on every blog post page. Two variants from one component:
// - lg+ (1024px): sticky right rail with the full archive, thumbnails included
// - below lg (tablets/phones): compact archive section that flows after the
//   article body, so no viewport misses the archive.
export function BlogArchive({ current }: { current?: string }) {
  const post = POSTS.find((p) => p.slug === current);
  return (
    <>
      <aside aria-label="Blog archive" className="hidden w-60 shrink-0 lg:block xl:w-72">
        <nav
          aria-label="All blog posts"
          className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
            From the archive
          </span>
          <ul className="mt-4 space-y-4">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/blog/${p.slug}`}
                  aria-current={p.slug === current ? 'page' : undefined}
                  className="group flex gap-3"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      width={64}
                      height={36}
                      className="mt-1 h-9 w-16 shrink-0 rounded border border-white/[0.06] object-cover"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <time dateTime={p.date} className="block font-mono text-[10px] text-slate-500">
                      {p.date}
                    </time>
                    <span
                      className={`text-[13px] leading-snug ${
                        p.slug === current
                          ? 'text-blue-200'
                          : 'text-slate-300 group-hover:text-blue-300'
                      }`}
                    >
                      {p.title}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href="/blog" className="mt-5 inline-block text-sm text-blue-400 hover:text-blue-300">
            All posts →
          </a>
        </nav>
      </aside>

      {/* Inline variant for viewports below lg — rendered by the flex parent
          after the article column; w-full so it wraps under the content. */}
      <section aria-label="Blog archive" className="mt-14 w-full max-w-3xl lg:hidden">
        {post?.tags?.length ? (
          <div className="mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
              Filed under
            </span>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-300"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
          From the archive
        </span>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {POSTS.filter((p) => p.slug !== current)
            .slice(0, 6)
            .map((p) => (
              <li key={p.slug}>
                <a
                  href={`/blog/${p.slug}`}
                  className="flex h-full gap-3 rounded border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-blue-500/40 hover:bg-blue-500/[0.04]"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      width={80}
                      height={45}
                      className="mt-1 h-[45px] w-20 shrink-0 rounded border border-white/[0.06] object-cover"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <time dateTime={p.date} className="block font-mono text-[10px] text-slate-500">
                      {p.date}
                    </time>
                    <span className="mt-1 block text-sm leading-snug text-slate-300">{p.title}</span>
                  </span>
                </a>
              </li>
            ))}
        </ul>
        <a href="/blog" className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300">
          All posts →
        </a>
      </section>
    </>
  );
}
