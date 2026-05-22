import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { auctionApi } from '../services/api';
import { useCart } from '../context/CartContext';

const fallbackItems = [
  { id: '1', title: 'Signed Author Book Bundle', description: "A complete signed collection of Natalie Cabinda's books, personally inscribed for the winner.", starting_bid: 75, current_bid: 110, emoji: '📚', active: true },
  { id: '2', title: 'One-Hour Private Coaching Session', description: 'A one-on-one virtual coaching session with Natalie Cabinda — tailored to your unique situation.', starting_bid: 150, current_bid: 200, emoji: '💬', active: true },
  { id: '3', title: 'RRR Gift Basket', description: 'A curated basket of RRR merchandise including books, journal, mug, affirmation cards, and more.', starting_bid: 85, current_bid: 120, emoji: '🎁', active: true },
  { id: '4', title: 'Virtual Workshop for Your Group', description: 'Natalie will host a 90-minute virtual workshop for your parent group, church, or organization (up to 50 participants).', starting_bid: 300, current_bid: 350, emoji: '🎤', active: true },
];

export default function AuctionItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState({});
  const [added, setAdded] = useState({});
  const { addItem } = useCart();

  useEffect(() => {
    auctionApi.getAll().then(r => {
      const data = r.data.length > 0 ? r.data : fallbackItems;
      setItems(data);
      const defaults = {};
      data.forEach(item => {
        const min = Number(item.current_bid || item.starting_bid);
        defaults[item.id] = (min + 10).toFixed(2);
      });
      setBidAmounts(defaults);
    }).catch(() => {
      setItems(fallbackItems);
      const defaults = {};
      fallbackItems.forEach(i => { defaults[i.id] = (Number(i.current_bid) + 10).toFixed(2); });
      setBidAmounts(defaults);
    }).finally(() => setLoading(false));
  }, []);

  const handleBid = (item) => {
    const amt = parseFloat(bidAmounts[item.id]);
    const min = Number(item.current_bid || item.starting_bid);
    if (!amt || amt <= min) {
      alert(`Your bid must be greater than the current bid of $${min.toFixed(2)}`);
      return;
    }
    addItem({
      id: item.id,
      type: 'auction',
      title: item.title,
      price: amt,
      emoji: item.emoji || '🏷️',
      meta: `Bid amount: $${amt.toFixed(2)}`,
    });
    setAdded(a => ({ ...a, [item.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [item.id]: false })), 1500);
  };

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
              {items.map(item => {
                const currentBid = Number(item.current_bid || item.starting_bid);
                const minNext = currentBid + 1;
                return (
                  <div key={item.id} className="card overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center">
                      <span className="text-7xl">{item.emoji || '🏷️'}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Starting Bid</p>
                            <p className="font-bold text-gray-700">${Number(item.starting_bid).toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Current Bid</p>
                            <p className="font-bold text-2xl text-accent">${currentBid.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 block mb-1">Your Bid (min ${minNext.toFixed(2)})</label>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 font-bold">$</span>
                              <input
                                type="number"
                                min={minNext}
                                step="1"
                                value={bidAmounts[item.id] || ''}
                                onChange={e => setBidAmounts(a => ({ ...a, [item.id]: e.target.value }))}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleBid(item)}
                            className={`self-end py-2 px-5 text-sm font-semibold rounded transition-all ${
                              added[item.id] ? 'bg-green-500 text-white' : 'bg-accent hover:bg-accent-dark text-white'
                            }`}
                          >
                            {added[item.id] ? '✓ Added!' : 'Place Bid'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
