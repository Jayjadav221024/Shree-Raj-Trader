import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { blogPostsWithImages } from '../data/blog';
import { copy } from '../data/sectionCopy';
import { fillTemplate } from '../lib/siteContent';
import SEO from '../components/SEO';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export default function BlogPostPage({ blogs: propBlogs }) {
  const { slug } = useParams();
  const list = propBlogs && propBlogs.length > 0 ? propBlogs : blogPostsWithImages;
  const post = list.find((p) => p.slug === slug);
  const c = copy['blog.post'];

  if (!post) {
    return (
      <section className="section page-top-spacing">
        <div className="container-page text-center">
          <h1 className="section-title">{c.notFoundTitle}</h1>
          <Link to="/blog/" className="btn btn-primary mt-6">
            <ArrowLeft className="w-4 h-4" />
            {c.notFoundCta}
          </Link>
        </div>
      </section>
    );
  }

  // Consecutive list items are grouped so they render as one <ul>.
  const grouped = [];
  if (post.body && Array.isArray(post.body)) {
    for (const block of post.body) {
      const last = grouped[grouped.length - 1];
      if (block.type === 'listItem' && last && last.type === 'list') last.items.push(block.text);
      else if (block.type === 'listItem') grouped.push({ type: 'list', items: [block.text] });
      else grouped.push(block);
    }
  }

  return (
    <section data-section="blog.post" className="section page-top-spacing">
      <SEO
        title={fillTemplate(copy['seo.blog-post'].title, { article: post.title })}
        description={fillTemplate(copy['seo.blog-post'].description, {
          article: post.title,
          excerpt: post.excerpt || post.body?.[0]?.text || '',
        })}
        image={post.image}
        imageAlt={post.imageAlt || post.title}
      />
      <div className="container-page" style={{ maxWidth: '820px' }}>
        <Link to="/blog/" className="btn btn-secondary btn-sm mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          {c.backToBlog}
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
          <Calendar className="w-3.5 h-3.5 text-orange" />
          {formatDate(post.date)}
        </div>

        <h1 className="section-title mt-3 mb-6">{post.title}</h1>

        <img
          src={post.image.src}
          alt={post.imageAlt || post.title}
          width={post.image.width}
          height={post.image.height}
          className="w-full h-auto rounded-[18px] border border-[var(--border-color)] mb-8"
        />

        <div className="space-y-4">
          {post.content ? (
            <div className="prose dark:prose-invert max-w-none text-[var(--text-muted)] leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            grouped.map((block, i) => {
              if (block.type === 'heading') {
                return <h2 key={i} className="text-xl sm:text-2xl font-display uppercase tracking-wide pt-4">{block.text}</h2>;
              }
              if (block.type === 'list') {
                return (
                  <ul key={i} className="space-y-2 pl-1">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[var(--text-muted)] text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] shrink-0 mt-2.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  {block.text}
                </p>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
