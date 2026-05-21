import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { auctionApi } from '../services/api';

const fallbackItems = [
  { id: '1', title: 'Signed Author Book Bundle', description: 'A complete signed collection of Natalie Cabinda\'s books, personally inscribed for the winner.', starting_bid: 75, current_bid: 110, emoji: '📚', active: true },
  { id: '2', title: 'One-Hour Private Coaching Session', description: 'A one-on-one virtual coaching session with Natalie Cabinda — tailored to your unique situation.', starting_bid: 150, current_bid: 200, emoji: '💬', active: true },
  { id: '3', title: 'RRR Gift Basket', description: 'A curated basket of RRR merchandise including books, journal, mug, affirmation cards, and more.', starting_bid: 85, current_bid: 120, emoji: '🎁', active: true },
  { id: '4', title: 'Virtual Workshop for Your Group', description: 'Natalie will host a 90-minute virtual workshop for your parent group, church, or organization (up to 50 participants).', starting_bid: 300, current_bid: 350, emoji: '🎤', active: true },
];

export default function AuctionItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auctionApi.getAll().then(r => {
      setItems(r.data.length > 0 ? r.data : fallbackItems);
    }).catch(() => setItems(fallbackItems)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Auction Items | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Auction Items" subtitle="Bid to Support the Mission" />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              All auction proceeds support the RRR Non Profit's programs for single parents and their children.
              Bid generously — every dollar goes directly to rebuilding families.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading auction items...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {items.map(item => (
                <div key={item.id} className="card overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center">
                    <span className="text-7xl">{item.emoji || '🏷️'}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Starting Bid</p>
                        <p className="font-bold text-gray-700">${Number(item.starting_bid).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Current Bid</p>
                        <p className="font-bold text-2xl text-accent">${Number(item.current_bid || item.starting_bid).toFixed(2)}</p>
                      </div>
                      <button className="btn-primary py-2 px-5 text-sm">Place Bid</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center bg-primary rounded-2xl p-8 text-white">
            <h3 className="font-heading text-2xl font-bold mb-3">Want to Donate an Item?</h3>
            <p className="text-white/70 mb-6">If you'd like to contribute an item to support our mission, we'd love to hear from you.</p>
            <a href="/contact" className="btn-primary">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
}
