import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { booksApi } from '../services/api';

export default function SignedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booksApi.getAll().then(r => setBooks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fallback = [
    {
      id: '1', title: 'Regroup Refocus Rebuild',
      subtitle: 'A Guide for Single Parents Navigating Life After Divorce',
      description: 'Drawing from 18+ years of educational experience, Natalie Cabinda offers practical strategies to help broken families rebuild after divorce. An essential resource for single parents seeking hope, healing, and a roadmap for a better future.',
      price: 19.99, signed_price: 29.99, amazon_url: 'https://amazon.com', is_signed: true, cover_image: '/images/book1-cover.png',
    },
    {
      id: '2', title: 'Their Gods Were Watching Me',
      subtitle: 'A Memoir by Natalie Cabinda',
      description: "A powerful memoir tracing Natalie Cabinda's remarkable journey — from her roots to the challenges of single parenthood — and the faith, resilience, and community that carried her through.",
      price: 17.99, signed_price: 27.99, amazon_url: 'https://amazon.com', is_signed: true, cover_image: '/images/book2-cover.jpg',
    },
  ];

  const displayBooks = books.length > 0 ? books : fallback;

  return (
    <>
      <Helmet><title>Signed Books | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Signed Books" subtitle="Personally Autographed by Natalie Cabinda" />

      {/* Intro */}
      <section className="py-12 bg-accent/10 border-b border-accent/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary font-semibold text-lg">
            ✍️ Each signed copy is personally inscribed by Natalie Cabinda. A perfect gift for someone who needs to hear that rebuilding is possible.
          </p>
        </div>
      </section>

      {/* Books */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading books...</div>
          ) : (
            <div className="space-y-12">
              {displayBooks.map((book, i) => (
                <div key={book.id} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Book visual */}
                  <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
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

                  {/* Book details */}
                  <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
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

                    <div className="flex flex-wrap gap-3">
                      <Link to="/contact" className="btn-gold flex-1 text-center">
                        Order Signed Copy
                      </Link>
                      {book.amazon_url && (
                        <a href={book.amazon_url} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 text-center">
                          Buy on Amazon
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      To order a signed copy, contact us with your name and personalization request.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Personalization note */}
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
