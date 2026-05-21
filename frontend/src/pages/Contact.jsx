import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { contactApi } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactApi.submit(form);
      setStatus('success');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet><title>Contact | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Get in Touch" subtitle="We'd Love to Hear From You" />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <p className="section-subtitle">Contact Information</p>
              <h2 className="section-title">Let's Connect</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're interested in booking a speaking engagement, ordering a signed book, learning about the
                RRR Non Profit, or simply have a question — Natalie would love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <a href="mailto:nataliecabinda@gmail.com" className="text-accent hover:underline">
                      nataliecabinda@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Follow Along</p>
                    <div className="flex gap-4 mt-1">
                      {['Facebook', 'Instagram', 'Twitter', 'Yelp'].map(s => (
                        <a key={s} href="#" className="text-accent text-sm hover:underline">{s}</a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Speaking Inquiries</p>
                    <p className="text-gray-500 text-sm">Available for keynotes, workshops, and seminars nationwide (virtual & in-person).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-heading text-2xl font-bold text-primary mb-6">Send a Message</h3>

              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h4 className="font-heading text-xl font-bold text-primary mb-2">Message Sent!</h4>
                  <p className="text-gray-600 mb-6">Thank you for reaching out. Natalie will get back to you within 48 hours.</p>
                  <button onClick={() => setStatus(null)} className="btn-primary text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                      placeholder="How can Natalie help you?" />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try emailing directly at nataliecabinda@gmail.com</p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
