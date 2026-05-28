import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { booksApi } from '../services/api';
import { useCart } from '../context/CartContext';

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <span className={`${sz} leading-none`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'text-[#FF9900]' : 'text-gray-300'}>★</span>
      ))}
    </span>
  );
}

// ── Auto-cycling Reviews Box ──────────────────────────────────────────────────
const SLIDE_INTERVAL = 5000; // ms between auto-advances

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true); // drives fade
  const intervalRef = useRef(null);
  const pausedRef   = useRef(false);
  const countRef    = useRef(0); // stable ref so interval never goes stale

  useEffect(() => {
    if (!bookId) return;
    booksApi.getReviews(bookId, 5)
      .then(r => setReviews(r.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [bookId]);

  // Keep countRef in sync
  useEffect(() => { countRef.current = reviews.length; }, [reviews.length]);

  // Fade-transition to a target index, then restart timer
  const goTo = useCallback((idx) => {
    setVisible(false);
    clearInterval(intervalRef.current);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
      // Restart the auto-advance after manual navigation
      if (countRef.current > 1) {
        intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
      }
    }, 250);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Defined after goTo so we can reference it in the restart above
  function advance() {
    if (pausedRef.current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(c => (c + 1) % countRef.current);
      setVisible(true);
    }, 250);
  }

  // Start auto-advance once reviews load
  useEffect(() => {
    if (reviews.length < 2) return;
    intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [reviews.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  if (loading) return (
    <div className="mt-8 text-center text-gray-400 text-sm py-4">Loading reviews…</div>
  );
  if (!reviews.length) return null;

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const r   = reviews[current];
  const date = r.review_date
    ? new Date(r.review_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-heading text-lg font-bold text-primary">Reader Reviews</h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={Math.round(avg)} />
          <span className="text-sm font-semibold text-gray-600">{avg}</span>
          <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Single review box */}
      <div
        className="border border-gray-200 rounded-2xl bg-gray-50 p-6 relative"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Fading review content */}
        <div
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
        >
          {/* Stars + verified */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <StarRating rating={r.rating} />
            {r.verified && (
              <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                ✓ Verified Purchase
              </span>
            )}
          </div>

          {/* Review title */}
          {r.title && (
            <p className="font-semibold text-sm text-gray-800 mb-1">{r.title}</p>
          )}

          {/* Reviewer + date */}
          <p className="text-xs text-gray-400 mb-3">
            {r.reviewer_name}{date && <> · {date}</>}
          </p>

          {/* Body */}
          <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
        </div>

        {/* Prev / Next arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + reviews.length) % reviews.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary hover:border-gray-400 transition text-xs"
              aria-label="Previous review"
            >‹</button>
            <button
              onClick={() => goTo((current + 1) % reviews.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary hover:border-gray-400 transition text-xs"
              aria-label="Next review"
            >›</button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-2 bg-accent'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400 text-center">
        Reviews from verified Amazon purchasers and readers.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SignedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});
  const { addItem } = useCart();

  const handleAdd = (book, isSigned) => {
    addItem({
      id: book.id,
      type: 'book',
      title: book.title,
      price: isSigned ? Number(book.signed_price || book.price * 1.5) : Number(book.price),
      isSigned,
      image: book.cover_image,
    });
    const key = `${book.id}-${isSigned ? 'signed' : 'regular'}`;
    setAdded(a => ({ ...a, [key]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [key]: false })), 1500);
  };

  useEffect(() => {
    booksApi.getAll()
      .then(r => setBooks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fallback = [
    {
      id: '1', title: 'Regroup Refocus Rebuild',
      subtitle: 'A Guide for Single Parents Navigating Life After Divorce',
      description: 'Drawing from 18+ years of educational experience, Natalie Cabinda offers practical strategies to help broken families rebuild after divorce. An essential resource for single parents seeking hope, healing, and a roadmap for a better future.',
      price: 19.99, signed_price: 29.99,
      amazon_url: 'https://www.amazon.com/Regroup-Refocus-Rebuild-Families-Navigate-Break-Ups-Breakthroughs/dp/1519741448',
      is_signed: true, cover_image: '/images/book1-cover.png',
    },
    {
      id: '2', title: 'Their Gods Were Watching Me',
      subtitle: 'A Memoir by Natalie Cabinda',
      description: "A powerful memoir tracing Natalie Cabinda's remarkable journey — from her roots to the challenges of single parenthood — and the faith, resilience, and community that carried her through.",
      price: 17.99, signed_price: 27.99,
      amazon_url: 'https://www.amazon.co.uk/Their-Gods-Were-Watching-Me/dp/1539944581',
      is_signed: true, cover_image: '/images/book2-cover.jpg',
    },
  ];

  const displayBooks = books.length > 0 ? books : fallback;

  return (
    <>
      <Helmet><title>Signed Books | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Signed Books" subtitle="Personally Autographed by Natalie Cabinda" />

      {/* Intro banner */}
      <section className="py-12 bg-accent/10 border-b border-accent/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold text-lg">
            ✍️ Each signed copy is personally inscribed by Natalie Cabinda. A perfect gift for someone who needs to hear that rebuilding is possible.
          </p>
        </div>
      </section>

      {/* Books + Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading books…</div>
          ) : (
            <div className="space-y-20">
              {displayBooks.map((book, i) => (
                <div key={book.id} className="border-b border-gray-100 pb-20 last:border-0 last:pb-0">

                  {/* Book layout: alternating left/right */}
                  <div className={`grid md:grid-cols-2 gap-10 items-start`}>

                    {/* Cover */}
                    <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                      <div className="relative">
                        <div className="w-full max-w-sm mx-auto h-80 rounded-2xl shadow-2xl overflow-hidden bg-primary-dark">
                          {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center">
                              <div className="text-center text-white px-6">
                                <div className="text-7xl mb-4">📚</div>
                                <h3 className="font-heading text-xl font-bold leading-tight">{book.title}</h3>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gold text-white text-xs font-bold px-3 py-2 rounded-full shadow">
                          SIGNED
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                      <h2 className="font-heading text-3xl font-bold text-primary mb-1">{book.title}</h2>
                      {book.subtitle && <p className="text-accent font-semibold mb-4">{book.subtitle}</p>}
                      <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>

                      {/* Pricing */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Regular Price</p>
                            <p className="text-2xl font-bold text-gray-700">${Number(book.price).toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-1">On Amazon</p>
                          </div>
                          <div className="text-center bg-gold/10 rounded-lg p-2 border border-gold/30">
                            <p className="text-xs text-gold uppercase tracking-wide mb-1">Signed Copy</p>
                            <p className="text-2xl font-bold text-gold">${Number(book.signed_price || book.price * 1.5).toFixed(2)}</p>
                            <p className="text-xs text-gold mt-1">Personalized</p>
                          </div>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleAdd(book, true)}
                          className={`flex-1 py-3 px-4 rounded font-semibold text-sm transition-all text-center ${
                            added[`${book.id}-signed`]
                              ? 'bg-green-500 text-white'
                              : 'bg-gold hover:opacity-90 text-white shadow'
                          }`}
                        >
                          {added[`${book.id}-signed`] ? '✓ Added to Cart!' : '✍️ Add Signed Copy to Cart'}
                        </button>
                        {book.amazon_url && (
                          <a
                            href={book.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline flex-1 text-center text-sm"
                          >
                            Buy on Amazon
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdd(book, false)}
                        className={`w-full mt-2 py-2 text-sm rounded border transition-all ${
                          added[`${book.id}-regular`]
                            ? 'border-green-400 text-green-600 bg-green-50'
                            : 'border-gray-200 text-gray-500 hover:border-accent hover:text-accent'
                        }`}
                      >
                        {added[`${book.id}-regular`] ? '✓ Added!' : `Add Regular Copy — $${Number(book.price).toFixed(2)}`}
                      </button>
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        Signed copies include personal inscription — add your request at checkout.
                      </p>
                    </div>
                  </div>

                  {/* Reviews — full width below the book grid */}
                  <BookReviews bookId={book.id} />

                </div>
              ))}
            </div>
          )}

          {/* Personalization CTA */}
          <div className="mt-16 bg-primary rounded-2xl p-8 text-center text-white">
            <h3 className="font-heading text-2xl font-bold mb-3">Want a Personal Inscription?</h3>
            <p className="text-white/70 mb-6">
              Each signed book can be personalized with a name, a message, or a dedication. Just let us know when you place your order.
            </p>
            <Link to="/contact" className="btn-primary">Place Your Order</Link>
          </div>
        </div>
      </section>
    </>
  );
}
