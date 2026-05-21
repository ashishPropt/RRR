import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { blogApi } from '../services/api';

const fallbackPosts = {
  'god-is-the-heroic-in-us': {
    title: 'God is the Heroic in Us', category: 'Inspiration', author: 'Natalie Cabinda', created_at: '2024-01-15',
    content: '<p>God is that HOPE we all nurse in our hearts for a better future. In the midst of life\'s most turbulent storms, it is faith that anchors us and reminds us that we are not alone in our journey.</p><p>For single parents navigating the aftermath of divorce, hope is not just a feeling — it is a lifeline. It is the belief that tomorrow can be better than today, that our children will thrive, and that we have the strength to rebuild our lives from whatever rubble remains.</p><p>When we tap into the divine spark within us, we discover resources we never knew we had. Patience we thought was exhausted. Love that multiplies rather than diminishes. The courage to face another day, to show up for our children, and to model resilience in the face of adversity.</p><p>Embrace the heroic in you. It was placed there for a reason — to carry you through the moments when you feel like giving up, and to propel you toward the life you were always meant to live.</p>',
  },
  'persistence-desire-behind-the-wheel': {
    title: 'Persistence — Desire Behind the Wheel', category: 'Inspiration', author: 'Natalie Cabinda', created_at: '2024-05-20',
    content: '<p>Desire is the driver behind the steering wheel of persistence. Without a clear and compelling vision of where you are going, the inevitable roadblocks of the journey will stop you. But when your desire is strong enough — when what you are moving toward matters deeply enough — persistence becomes not a virtue you have to manufacture, but a natural consequence of your commitment.</p><p>For single parents, this is particularly relevant. The road ahead is genuinely hard. There will be days when exhaustion wins, when the weight of doing everything alone feels unbearable, when the gap between where you are and where you want to be seems impossibly wide.</p><p>On those days, return to your why. Not the abstract, someday-I-want-to why — but the specific, immediate, living why. The face of a child who needs you. The version of yourself you are becoming. The life you are building, brick by brick, day by day.</p><p>Persistence does not require feeling strong. It only requires taking the next step. And the next. And the next.</p>',
  },
  'post-divorce-stress-management': {
    title: 'Post Divorce Issue #6: Stress Management', category: 'Post-Divorce Series', author: 'Natalie Cabinda', created_at: '2024-02-28',
    content: '<p>Stress is a nonspecific response of your body to demands made upon it. For single parents post-divorce, these demands can feel overwhelming — managing the household alone, maintaining your career, being emotionally present for your children, and carving out time for your own healing.</p><h3>Practical Stress Management Strategies</h3><ul><li><strong>Prioritize sleep:</strong> Everything is harder when you are exhausted. Protect your sleep as a non-negotiable.</li><li><strong>Move your body:</strong> Even a 20-minute walk can significantly reduce cortisol levels and shift your perspective.</li><li><strong>Build your support network:</strong> Isolation amplifies stress. Reach out to family, friends, faith communities.</li><li><strong>Practice mindfulness:</strong> Five minutes of conscious breathing can interrupt the stress cycle.</li><li><strong>Set boundaries:</strong> Say no to what drains you and yes to what restores you.</li></ul><p>Remember: you cannot pour from an empty cup. Taking care of yourself is not selfish — it is essential.</p>',
  },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true); setError(false);
    blogApi.getBySlug(slug)
      .then(r => setPost(r.data))
      .catch(() => {
        if (fallbackPosts[slug]) setPost(fallbackPosts[slug]);
        else setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-gray-400 text-lg">Loading post...</div>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <h2 className="font-heading text-3xl font-bold text-primary">Post Not Found</h2>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{post.title} | Regroup Refocus Rebuild</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Helmet>

      {/* Hero */}
      <div className="pt-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">{post.category}</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
            <span>By {post.author || 'Natalie Cabinda'}</span>
            <span>·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Author card */}
          <div className="mt-16 border-t pt-10 flex gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👩‍💼</span>
            </div>
            <div>
              <p className="font-bold text-primary text-lg">{post.author || 'Natalie Cabinda'}</p>
              <p className="text-accent text-sm font-semibold mb-2">Educator · Author · Mentor</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                With over 18 years of educational experience, Natalie Cabinda helps single parents regroup, refocus, and rebuild after divorce.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center border-t pt-8">
            <Link to="/blog" className="text-accent font-semibold hover:underline">← All Posts</Link>
            <Link to="/contact" className="btn-primary text-sm py-2">Get in Touch</Link>
          </div>
        </div>
      </article>
    </>
  );
}
