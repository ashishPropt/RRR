import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { blogApi } from '../services/api';

const fallbackPosts = [
  { slug: 'god-is-the-heroic-in-us', title: 'God is the Heroic in Us', excerpt: 'God is that HOPE we all nurse in our hearts for a better future.', category: 'Inspiration', created_at: '2024-01-15' },
  { slug: 'be-the-change-you-d-like-to-see', title: "Be the Change You'd Like to See", excerpt: 'During a particularly harsh winter, I found myself snowed in with 33 inches of snow — and an unexpected gift: time to reflect.', category: 'Personal Development', created_at: '2024-02-10' },
  { slug: 'post-divorce-stress-management', title: 'Post Divorce Issue #6: Stress Management', excerpt: 'Stress is a nonspecific response of your body to demands made upon it. Here are strategies that work.', category: 'Post-Divorce Series', created_at: '2024-02-28' },
  { slug: 'post-divorce-embrace-optimism', title: 'Post Divorce Issue #1: Embrace Optimism', excerpt: 'The mindset you carry into your post-divorce life will determine more about your outcome than almost any other factor.', category: 'Post-Divorce Series', created_at: '2024-03-05' },
  { slug: 'post-divorce-children-troubleshooting', title: 'Post Divorce Issue #4: Children — Troubleshooting', excerpt: 'Divorce affects children differently depending on their age, temperament, and the nature of the co-parenting relationship.', category: 'Post-Divorce Series', created_at: '2024-03-20' },
  { slug: 'decluttering-inside-and-out', title: 'Decluttering — Inside and Out', excerpt: 'There is something profoundly therapeutic about clearing physical space when your life is in transition.', category: 'Lifestyle', created_at: '2024-04-01' },
  { slug: 'post-divorce-raising-high-achievers', title: 'Post Divorce Issue #11: Raising High Achievers', excerpt: 'One of the most common fears among single parents is that divorce will derail their children\'s potential.', category: 'Post-Divorce Series', created_at: '2024-04-15' },
  { slug: 'post-divorce-faith-in-your-abilities', title: 'Post Divorce Issue #5: Having Faith in Your Abilities', excerpt: 'Self-doubt is one of the most insidious side effects of divorce. Here is how to rebuild your confidence.', category: 'Post-Divorce Series', created_at: '2024-05-01' },
  { slug: 'persistence-desire-behind-the-wheel', title: 'Persistence — Desire Behind the Wheel', excerpt: 'Desire is the driver behind the steering wheel of persistence. Without a compelling vision, roadblocks will stop you.', category: 'Inspiration', created_at: '2024-05-20' },
  { slug: 'step-on-the-ladder', title: 'Step on the Ladder', excerpt: 'Every significant achievement in life began with a single, often unremarkable step. Start climbing today.', category: 'Motivation', created_at: '2024-06-01' },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (activeCategory !== 'All') params.category = activeCategory;
    blogApi.getAll(params)
      .then(r => {
        setPosts(r.data.posts?.length > 0 ? r.data.posts : fallbackPosts);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, [page, activeCategory]);

  useEffect(() => {
    blogApi.getCategories()
      .then(r => setCategories(r.data))
      .catch(() => setCategories([
        { category: 'Post-Divorce Series', count: 6 },
        { category: 'Inspiration', count: 2 },
        { category: 'Personal Development', count: 1 },
        { category: 'Lifestyle', count: 1 },
      ]));
  }, []);

  const handleCategory = (cat) => { setActiveCategory(cat); setPage(1); };

  return (
    <>
      <Helmet><title>Blog | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Blog" subtitle="Insights, Inspiration & Practical Advice" />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <button onClick={() => handleCategory('All')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === 'All' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All Posts
            </button>
            {categories.map(c => (
              <button key={c.category} onClick={() => handleCategory(c.category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === c.category ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.category} <span className="opacity-60 ml-1">({c.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading posts...</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="card group">
                    <div className="h-44 bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center relative overflow-hidden">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <img src="/images/child-family.jpg" alt={post.title} className="w-full h-full object-cover opacity-60" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-accent uppercase tracking-widest">{post.category}</span>
                        <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                      </div>
                      <h2 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                      <p className="text-accent text-sm font-semibold mt-4">Read More →</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${p === page ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
