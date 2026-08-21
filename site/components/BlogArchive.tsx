import { POSTS } from '@/lib/blog';

export function BlogArchive({ current }: { current?: string }) {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded border border-white/[0.06] bg-white/[0.02] p-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-300/80">
          From the archive
        </span>
        <ul className="mt-4 space-y-4">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`} className="block">
                <time dateTime={post.date} className="block font-mono text-[10px] text-slate-500">
                  {post.date}
                </time>
                <span
                  className={`text-sm leading-snug ${
                    post.slug === current ? 'text-blue-200' : 'text-slate-300 hover:text-blue-300'
                  }`}
                >
                  {post.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href="/blog" className="mt-5 inline-block text-sm text-blue-400 hover:text-blue-300">
          All posts →
        </a>
      </div>
    </aside>
  );
}
