import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Helmet } from 'react-helmet-async';
import { blogApi, booksApi } from '../services/api';

const heroSlides = [
  {
    img: '/images/hero-park.jpg',
    title: 'Regroup. Refocus. Rebuild.',
    subtitle: 'Practical strategies for single parents navigating life after divorce.',
    cta: { label: 'Get the Book', path: '/signed-books' },
  },
  {
    img: '/images/hero-women.jpg',
    quote: '"This book gave me hope when I thought there was none left."',
    quoteAuthor: '— A Grateful Reader',
    title: 'You Are Stronger Than You Know',
    cta: { label: 'Read the Blog', path: '/blog' },
  },
  {
    img: '/images/hero-ocean.jpg',
    title: 'Rebuilding Takes Courage',
    subtitle: 'Join a community of resilient single parents moving forward together.',
    cta: { label: 'Learn More', path: '/about' },
  },
  {
    img: '/images/child-family.jpg',
    title: 'Your Children Are Watching',
    subtitle: 'Show them what resilience looks like. Every single day.',
    cta: { label: 'Our Mission', path: '/rrr-non-profit' },
  },
];

const philosophyBeliefs = [
  { icon: '👨‍👩‍👧', title: 'Parent Behavior Shapes Children', desc: 'How we show up as parents — in our words, our choices, our resilience — is the most powerful educational force in a child\'s life.' },
  { icon: '💬', title: 'Patience & Communication Are Essential', desc: 'Single parenting demands extraordinary patience. Open, honest communication with your children builds trust that lasts a lifetime.' },
  { icon: '🤝', title: 'Community Support Is Critical', desc: 'No one rebuilds alone. A strong support network of family, friends, and community is foundational to thriving after divorce.' },
];

const sliderSettings = {
  dots: true, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1,
  autoplay: true, autoplaySpeed: 5000, fade: true, arrows: false,
};

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    blogApi.getRecent(3).then(r => setRecentPosts(r.data)).catch(() => {});
    booksApi.getAll().then(r => setBooks(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Regroup Refocus Rebuild | Natalie Cabinda</title></Helmet>

      {/* Hero Slider */}
      <div className="pt-16 md:pt-20">
        <Slider {...sliderSettings}>
          {heroSlides.map((slide, i) => (
            <div key={i}>
              <div className="min-h-[600px] md:min-h-[700px] flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background photo */}
                <img src={slide.img} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-primary/70" />
                <div className="relative text-center max-w-3xl mx-auto fade-in-up">
                  {slide.quote && (
                    <blockquote className="text-2xl md:text-3xl italic text-white/90 mb-4 font-heading leading-relaxed">
                      {slide.quote}
                    </blockquote>
                  )}
                  {slide.quoteAuthor && <p className="text-accent font-semibold mb-6">{slide.quoteAuthor}</p>}
                  <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  {slide.subtitle && <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">{slide.subtitle}</p>}
                  <Link to={slide.cta.path} className="btn-primary text-base px-8 py-4">
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Author Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="section-subtitle">Meet the Author</p>
              <h2 className="section-title">Natalie Cabinda</h2>
              <p className="text-accent font-semibold text-lg mb-4">Educator · Author · Mentor · Speaker · Consultant</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                With over 18 years of educational experience and a deeply personal journey through divorce and single parenting,
                Natalie Cabinda has dedicated her life to helping broken families rebuild — stronger, wiser, and more resilient than before.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Her work draws on professional expertise and lived experience to offer strategies that are practical, compassionate,
                and grounded in the real challenges single parents face every day. Whether through her books, speaking engagements,
                or one-on-one mentorship, Natalie meets people where they are and walks with them toward where they want to be.
              </p>
              <Link to="/about" className="btn-primary">Learn More About Natalie</Link>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-accent/40">
                  <img src="/images/natalie-author.jpg" alt="Natalie Cabinda" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold rounded-full opacity-80" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent rounded-full opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="section-subtitle">Core Beliefs</p>
          <h2 className="section-title">Our Philosophy</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            Every strategy, book, and conversation Natalie brings to single parents is rooted in these foundational beliefs.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophyBeliefs.map((b) => (
              <div key={b.title} className="card p-8 text-center">
                <div className="text-5xl mb-4">{b.icon}</div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">{b.title}</h3>
                <p className="text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="section-subtitle text-accent">Available Now</p>
          <h2 className="font-heading text-4xl font-bold text-white mb-4">Books by Natalie Cabinda</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-12">
            Essential reading for any single parent ready to move forward with intention, hope, and practical guidance.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {(books.length > 0 ? books : [
                { id: '1', title: 'Regroup Refocus Rebuild', subtitle: 'Helping Families Navigate From Break-Ups to Breakthroughs!', cover_image: '/images/book1-cover.png', amazon_url: 'https://www.amazon.com' },
                { id: '2', title: 'Their Gods Were Watching Me', subtitle: 'A Memoir by Natalie Cabinda', cover_image: '/images/book2-cover.jpg', amazon_url: 'https://www.amazon.com' },
              ]).map((book) => (
              <div key={book.id} className="bg-white/10 rounded-xl p-8 text-left backdrop-blur border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-full h-64 rounded-lg mb-6 overflow-hidden flex items-center justify-center bg-primary-dark">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-6xl">📚</span>
                  )}
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">{book.title}</h3>
                {book.subtitle && <p className="text-accent text-sm mb-3">{book.subtitle}</p>}
                {book.description && <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">{book.description}</p>}
                <div className="flex gap-3 flex-wrap">
                  {book.amazon_url && (
                    <a href={book.amazon_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2">
                      Buy on Amazon
                    </a>
                  )}
                  <Link to="/signed-books" className="btn-gold text-sm py-2">Signed Copy</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/signed-books" className="btn-primary text-base px-8 py-4">View All Books & Signed Copies</Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Insights & Inspiration</p>
            <h2 className="section-title">From the Blog</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(recentPosts.length > 0 ? recentPosts : [
              { slug: 'god-is-the-heroic-in-us', title: 'God is the Heroic in Us', excerpt: 'God is that HOPE we all nurse in our hearts for a better future...', category: 'Inspiration', created_at: '2024-01-15' },
              { slug: 'persistence-desire-behind-the-wheel', title: 'Persistence — Desire Behind the Wheel', excerpt: 'Desire is the driver behind the steering wheel of persistence...', category: 'Motivation', created_at: '2024-05-20' },
              { slug: 'post-divorce-embrace-optimism', title: 'Post Divorce Issue #1: Embrace Optimism', excerpt: 'The mindset you carry into your post-divorce life will determine everything...', category: 'Post-Divorce Series', created_at: '2024-03-05' },
            ]).map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="card group">
                <div className="h-44 bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center">
                  <span className="text-5xl">✍️</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-accent uppercase tracking-widest">{post.category}</span>
                  <h3 className="font-heading text-xl font-bold text-primary mt-2 mb-3 group-hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <p className="text-accent text-sm font-semibold mt-4">Read More →</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/blog" className="btn-primary">View All Posts</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-accent-dark to-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Begin Your Rebuild?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Whether you need a book, a speaker, or just someone who understands — Natalie is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-primary font-bold px-8 py-4 rounded hover:shadow-xl transition-all">
              Get in Touch
            </Link>
            <Link to="/signed-books" className="btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              Shop Books
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
