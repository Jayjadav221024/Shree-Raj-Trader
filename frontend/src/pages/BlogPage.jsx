import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Search, LayoutGrid, List, SlidersHorizontal, X, BookOpen, Clock } from 'lucide-react';
import { blogPostsWithImages } from '../data/blog';
import { copy } from '../data/sectionCopy';
import SEO from '../components/SEO';

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

function getBlogTopic(title = '', slug = '') {
  const combined = `${title} ${slug}`.toLowerCase();
  if (combined.includes('motor')) return 'Motors';
  if (combined.includes('switchgear') || combined.includes('mcb') || combined.includes('mccb')) return 'Switchgears';
  if (combined.includes('frp') || combined.includes('tray') || combined.includes('grating')) return 'FRP Composites';
  return 'Industrial Insights';
}

const TOPIC_CATEGORIES = ['All Topics', 'Motors', 'Switchgears', 'FRP Composites', 'Industrial Insights'];

export default function BlogPage({ blogs: propBlogs }) {
  const rawList = propBlogs && propBlogs.length > 0 ? propBlogs : blogPostsWithImages;
  const c = copy['blog.header'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'title-asc' | 'title-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredAndSortedBlogs = useMemo(() => {
    let result = rawList.map((post) => ({
      ...post,
      topic: getBlogTopic(post.title, post.slug)
    }));

    // Search query filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(q)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
          post.topic.toLowerCase().includes(q)
      );
    }

    // Category topic filter
    if (selectedTopic !== 'All Topics') {
      result = result.filter((post) => post.topic === selectedTopic);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01');
      }
      if (sortBy === 'oldest') {
        return new Date(a.date || '1970-01-01') - new Date(b.date || '1970-01-01');
      }
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    return result;
  }, [rawList, searchQuery, selectedTopic, sortBy]);

  return (
    <section className="section page-top-spacing min-h-screen">
      <SEO title={copy['seo.blog'].title} description={copy['seo.blog'].description} />
      <div className="container-page">
        {/* Header */}
        <div data-section="blog.header" className="section-header max-w-2xl mx-auto">
          <span className="eyebrow eyebrow-teal">
            <BookOpen className="w-3.5 h-3.5" />
            {c.eyebrow}
          </span>
          <h1 className="section-title">
            Industry Insights & <span className="text-orange">{c.titleAccent}</span>
          </h1>
          <p>{c.intro}</p>
        </div>

        {/* Filter, Search & View Controls Bar */}
        <div className="card p-5 bg-white border border-[var(--border-color)] shadow-xs rounded-2xl mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles, technical guides, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-orange)] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown & View Mode Switcher */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden sm:inline" />
                <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-orange)] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title (A - Z)</option>
                  <option value="title-desc">Title (Z - A)</option>
                </select>
              </div>

              {/* View Toggle: Grid vs List */}
              <div className="flex items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                    viewMode === 'grid'
                      ? 'bg-white text-[var(--accent-orange)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  aria-label="Grid View"
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                    viewMode === 'list'
                      ? 'bg-white text-[var(--accent-orange)] shadow-xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  aria-label="List View"
                  title="List View"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Topic Category Chips & Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {TOPIC_CATEGORIES.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedTopic === topic
                      ? 'bg-[var(--accent-cyan)] text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-[var(--text-muted)] shrink-0 self-end sm:self-center">
              Showing <span className="font-bold text-[var(--text-main)]">{filteredAndSortedBlogs.length}</span> articles
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="card p-12 text-center bg-white border border-[var(--border-color)] rounded-2xl">
            <BookOpen className="w-10 h-10 text-[var(--text-faint)] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">No articles found</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any articles matching your search or filters. Try adjusting your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All Topics');
              }}
              className="btn btn-secondary btn-sm mt-4 inline-flex items-center gap-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBlogs.map((post) => (
              <article key={post.slug} className="product-card flex flex-col group h-full">
                <Link to={`/blog/${post.slug}/`} className="block relative overflow-hidden bg-[var(--bg-secondary)]">
                  {post.image?.src && (
                    <img
                      src={post.image.src}
                      alt={post.imageAlt || post.title}
                      width={post.image.width}
                      height={post.image.height}
                      loading="lazy"
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="badge-tag bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[var(--accent-cyan)] shadow-xs">
                      {post.topic}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                      <Calendar className="w-3.5 h-3.5 text-orange shrink-0" />
                      {formatDate(post.date)}
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl leading-tight mt-3">
                      <Link to={`/blog/${post.slug}/`} className="hover:text-[var(--accent-orange)] transition">
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-[var(--text-muted)] mt-2.5 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-[var(--border-color)]">
                    <Link to={`/blog/${post.slug}/`} className="btn btn-secondary btn-sm inline-flex items-center gap-2">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredAndSortedBlogs.map((post) => (
              <article
                key={post.slug}
                className="card card-hover p-5 sm:p-6 bg-white border border-[var(--border-color)] rounded-2xl flex flex-col md:flex-row gap-6 items-center group"
              >
                <Link
                  to={`/blog/${post.slug}/`}
                  className="w-full md:w-64 h-44 rounded-xl overflow-hidden shrink-0 bg-[var(--bg-secondary)] relative block"
                >
                  {post.image?.src && (
                    <img
                      src={post.image.src}
                      alt={post.imageAlt || post.title}
                      width={post.image.width}
                      height={post.image.height}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="badge-tag bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[var(--accent-cyan)] shadow-xs">
                      {post.topic}
                    </span>
                  </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                      <Calendar className="w-3.5 h-3.5 text-orange shrink-0" />
                      {formatDate(post.date)}
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight mt-2 text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors">
                      <Link to={`/blog/${post.slug}/`}>
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="btn btn-secondary btn-sm inline-flex items-center gap-2"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-xs text-[var(--text-faint)] font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-faint)]" /> 4 min read
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
