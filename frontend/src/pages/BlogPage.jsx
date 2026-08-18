import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPostsWithImages } from '../data/blog';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export default function BlogPage() {
  return (
    <section className="section page-top-spacing">
      <div className="container-page">
        <div className="section-header">
          <span className="eyebrow">Insights &amp; Guides</span>
          <h1 className="section-title">
            <span className="text-orange">Blog</span>
          </h1>
          <p>
            Technical guidance on switchgears, industrial motors, FRP gratings and cable trays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPostsWithImages.map((post) => (
            <article key={post.slug} className="product-card">
              <Link to={`/blog/${post.slug}/`} className="block">
                <img
                  src={post.image.src}
                  alt={post.title}
                  width={post.image.width}
                  height={post.image.height}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                  <Calendar className="w-3.5 h-3.5 text-orange" />
                  {formatDate(post.date)}
                </div>

                <h3 className="font-display text-xl sm:text-2xl leading-tight mt-3">
                  <Link to={`/blog/${post.slug}/`} className="hover:text-[var(--accent-orange)] transition">
                    {post.title}
                  </Link>
                </h3>

                {post.excerpt && (
                  <p className="text-sm text-[var(--text-muted)] mt-2.5 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                )}

                <Link to={`/blog/${post.slug}/`} className="btn btn-secondary btn-sm mt-5 self-start">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
