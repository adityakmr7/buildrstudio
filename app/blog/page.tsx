import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { getHashnodePostsPage } from "../lib/hashnode";

export const metadata: Metadata = {
  title: "BuildrStudio Blog",
  description: "Latest posts from Aditya Kumar's Hashnode blog.",
};

function formatPublishDate(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function getPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }> | { page?: string };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams =
    searchParams && "then" in searchParams ? await searchParams : searchParams;
  const rawPage = resolvedSearchParams?.page;
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const requestedPage = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);

  let publicationTitle = "Hashnode Blog";
  let blogPosts: Awaited<ReturnType<typeof getHashnodePostsPage>>["posts"] = [];
  let currentPage = 1;
  let totalPages = 1;
  let hasPreviousPage = false;
  let hasNextPage = false;
  let totalPosts = 0;
  let hasFetchError = false;

  try {
    const feed = await getHashnodePostsPage(requestedPage, 6);
    publicationTitle = feed.publicationTitle;
    blogPosts = feed.posts;
    currentPage = feed.currentPage;
    totalPages = feed.totalPages;
    hasPreviousPage = feed.hasPreviousPage;
    hasNextPage = feed.hasNextPage;
    totalPosts = feed.totalPosts;
  } catch {
    hasFetchError = true;
  }

  return (
    <>
      <style>{`
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background .3s, border .3s;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .site-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--fill-text);
          font-weight: 800;
        }
        .site-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all .15s;
        }
        .nav-link:hover {
          background: var(--fill-subtle);
          color: var(--text-1);
        }
        .nav-link.active {
          background: var(--fill-subtle);
          color: var(--text-1);
          font-weight: 700;
        }
        .page-shell {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px;
        }
        .hero-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          padding: 40px;
          margin-bottom: 28px;
        }
        .hero-title {
          font-size: 36px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 10px;
        }
        .hero-desc {
          font-size: 16px;
          color: var(--text-2);
          max-width: 700px;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        .post-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 100%;
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .post-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .post-cover {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }
        .post-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .post-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-1);
          letter-spacing: -0.3px;
          line-height: 1.3;
        }
        .post-brief {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          flex: 1;
        }
        .post-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--text-3);
          font-size: 12px;
        }
        .post-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .empty-state {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 26px;
        }
        .pagination-wrap {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pagination-summary {
          font-size: 13px;
          color: var(--text-3);
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .page-btn {
          min-width: 38px;
          height: 38px;
          padding: 0 10px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-2);
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all .15s;
        }
        .page-btn:hover {
          border-color: var(--border-strong);
          color: var(--text-1);
          background: var(--fill-subtle);
        }
        .page-btn.active {
          background: var(--fill);
          border-color: var(--fill);
          color: var(--fill-text);
        }
        .page-btn.disabled {
          opacity: .5;
          pointer-events: none;
        }
        .page-gap {
          color: var(--text-3);
          font-size: 12px;
          padding: 0 2px;
        }
        .site-footer {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 40px 64px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-left {
          font-size: 13px;
          color: var(--text-3);
        }
        .footer-left strong {
          color: var(--text-1);
        }
        .footer-right {
          font-size: 12px;
          color: var(--text-4);
        }
        @media (max-width: 1024px) {
          .posts-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .site-header {
            padding: 16px 20px;
          }
          .page-shell {
            padding: 28px 20px 48px;
          }
          .hero-card {
            padding: 24px;
          }
          .hero-title {
            font-size: 28px;
          }
          .posts-grid {
            grid-template-columns: 1fr;
          }
          .site-footer {
            padding: 20px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}</style>

      <header className="site-header">
        <div className="site-logo">
          <div className="site-logo-mark">B</div>
          <span className="site-logo-text">BuildrStudio</span>
        </div>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/#anchor" className="nav-link">
            Anchor
          </Link>
          <Link href="/#flowzy" className="nav-link">
            Flowzy
          </Link>
          <Link href="/blog" className="nav-link active">
            Blog
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-shell">
        <section className="hero-card">
          <span className="ink-label">Latest Writing</span>
          <h1 className="hero-title">{publicationTitle}</h1>
          <p className="hero-desc">
            Notes on frontend architecture, React Native patterns, product building,
            and the systems behind focused apps.
          </p>
          <div className="meta-row">
            <span className="chip-filled">Hashnode</span>
            <span className="chip-subtle">@adityakmr</span>
            <a
              href="https://adityakmr.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-sm"
            >
              Visit Full Blog
            </a>
          </div>
        </section>

        {hasFetchError ? (
          <div className="empty-state">
            <p className="ink-body">
              We could not load blog posts right now. Please refresh and try again.
            </p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="empty-state">
            <p className="ink-body">No posts are available yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <section className="posts-grid">
              {blogPosts.map((post) => (
                <article key={post.id} className="post-card">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="post-cover"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="post-content">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-brief">{post.brief}</p>

                    {post.tags.length > 0 ? (
                      <div className="post-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={`${post.id}-${tag}`} className="chip-subtle">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="post-meta">
                      <span>
                        {formatPublishDate(post.publishedAt)} · {post.readTimeInMinutes} min read
                      </span>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost btn-sm"
                      >
                        Read
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {totalPages > 1 ? (
              <nav className="pagination-wrap" aria-label="Blog pagination">
                <p className="pagination-summary">
                  {totalPosts} posts · Page {currentPage} of {totalPages}
                </p>
                <div className="pagination-controls">
                  <Link
                    href={getPageHref(currentPage - 1)}
                    className={`page-btn${hasPreviousPage ? "" : " disabled"}`}
                    aria-disabled={!hasPreviousPage}
                  >
                    Previous
                  </Link>

                  {getVisiblePages(currentPage, totalPages).map((page, index, pages) => {
                    const previousPage = pages[index - 1];
                    const showGap = previousPage && page - previousPage > 1;

                    return (
                      <span key={`page-wrap-${page}`}>
                        {showGap ? <span className="page-gap">...</span> : null}
                        <Link
                          href={getPageHref(page)}
                          className={`page-btn${page === currentPage ? " active" : ""}`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </Link>
                      </span>
                    );
                  })}

                  <Link
                    href={getPageHref(currentPage + 1)}
                    className={`page-btn${hasNextPage ? "" : " disabled"}`}
                    aria-disabled={!hasNextPage}
                  >
                    Next
                  </Link>
                </div>
              </nav>
            ) : null}
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-left">
          <strong>BuildrStudio</strong> by Aditya Kumar · 2026
        </div>
        <div className="footer-right">Powered by Ink Design System</div>
      </footer>
    </>
  );
}
