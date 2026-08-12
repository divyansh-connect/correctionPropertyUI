import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blogData';
import { BookOpen, Clock, User, ArrowRight, Search, Mail } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'AI & Automation', 'Rent Collection', 'Owner Relations', 'Maintenance', 'Accounting'];

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.filter((p) => !p.featured);

  const filteredPosts = selectedCategory === 'All'
    ? regularPosts
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={BookOpen} className="mb-4">
            Property Insights & Resources
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Real Estate Management & PropTech Articles
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            Expert strategies, industry guides, property accounting insights, and predictive AI trends for modern landlords and property managers.
          </p>
        </div>
      </section>

      {/* Main Blog Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article Card */}
          <div className="mb-16">
            <Card variant="beige" className="p-8 sm:p-12 border-brand-slate-accent relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="gold">Featured Article</Badge>
                    <span className="text-xs text-brand-neutral-muted font-semibold">{featuredPost.category}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-neutral-dark leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-base text-brand-neutral-muted leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-6 pt-2 text-xs text-brand-neutral-muted">
                    <span className="flex items-center gap-1.5 font-bold text-brand-neutral-dark">
                      <User className="w-4 h-4 text-brand-blue" /> {featuredPost.author} ({featuredPost.authorRole})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <div className="pt-4">
                    <Button to={`/blog`} variant="primary" size="md" icon={ArrowRight}>
                      Read Full Article
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 sm:h-80 rounded-2xl object-cover shadow-md border border-brand-neutral-border"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-blue text-white shadow-xs'
                    : 'bg-brand-slate text-brand-neutral-dark hover:bg-brand-slate-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredPosts.map((post) => (
              <Card key={post.id} variant="white" className="flex flex-col justify-between h-full group">
                <div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 rounded-xl object-cover mb-5 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="flex items-center justify-between text-xs text-brand-neutral-muted mb-2">
                    <Badge variant="neutral">{post.category}</Badge>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-neutral-dark mb-2 group-hover:text-brand-blue transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-brand-neutral-muted leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-slate flex items-center justify-between text-xs font-bold text-brand-blue">
                  <span>{post.author}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-brand-blue text-white text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-3 rounded-2xl bg-white/10 text-brand-indigo-light inline-block">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Subscribe to Property Leadership Insights</h3>
              <p className="text-xs sm:text-sm text-gray-200">
                Get monthly real estate trends, regulatory updates, and software automation tips delivered directly to your inbox.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your work email address"
                  className="px-4 py-3 rounded-xl bg-white text-brand-neutral-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo flex-grow"
                  required
                />
                <Button type="submit" variant="gold" size="md" className="shrink-0">
                  Subscribe Free
                </Button>
              </form>
              <p className="text-[11px] text-gray-300">No spam. Unsubscribe anytime with one click.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
