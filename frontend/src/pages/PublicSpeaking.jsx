import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { speakingApi } from '../services/api';

const topics = [
  'Post-Divorce Recovery & Resilience',
  'Raising High-Achieving Children in Single-Parent Homes',
  'Stress Management for Single Parents',
  'Building Community Support Networks',
  'Embracing Optimism After Loss',
  'Co-Parenting with Dignity',
  'Financial Empowerment for Single Parents',
  'Academic Success Strategies for Children of Divorce',
];

const formats = [
  { icon: '🎤', title: 'Keynote Address', desc: '45–90 minutes. A powerful, high-energy talk tailored to your audience — schools, nonprofits, faith communities, or corporate wellness programs.' },
  { icon: '🛠️', title: 'Workshop', desc: 'Half-day or full-day interactive sessions with practical tools, group discussion, and personalized action planning.' },
  { icon: '💻', title: 'Virtual Session', desc: 'All programs available online via Zoom or your preferred platform. Perfect for remote teams, parent groups, or national audiences.' },
  { icon: '📅', title: 'Seminar Series', desc: 'Multi-week programs that go deep — covering the full arc of post-divorce recovery and rebuilding for sustained transformation.' },
];

export default function PublicSpeaking() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    speakingApi.getAll().then(r => setEvents(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Public Speaking | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Public Speaking" subtitle="Inspiring Audiences to Rebuild" />

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">Book Natalie</p>
              <h2 className="section-title">A Speaker Who Has Lived the Message</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Natalie Cabinda does not just talk about resilience — she has lived it. Her speaking engagements combine
                professional expertise with personal authenticity, leaving audiences not just inspired but equipped.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether she is addressing a room of single parents, educators, students, or corporate professionals navigating
                life transitions, Natalie meets audiences where they are and walks them toward where they could be.
              </p>
              <Link to="/contact" className="btn-primary">Book Natalie to Speak</Link>
            </div>
            <div className="bg-gradient-to-br from-primary to-accent-dark rounded-2xl p-8 text-white relative overflow-hidden">
                <img src="/images/natalie-photo2.jpg" alt="Natalie Cabinda speaking" className="absolute inset-0 w-full h-full object-cover opacity-20 object-top" />
              <h3 className="font-heading text-2xl font-bold mb-6">Speaking Topics</h3>
              <ul className="space-y-3">
                {topics.map(t => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-white/90 text-sm">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="section-title mb-10">Speaking Formats</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map(f => (
              <div key={f.title} className="card p-6 text-left">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-heading text-lg font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="section-title text-center mb-10">Upcoming Engagements</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {events.map(e => (
                <div key={e.id} className="card p-6">
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">{e.title}</h3>
                  <p className="text-accent text-sm font-semibold mb-3">{e.location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to Book Natalie?</h2>
          <p className="text-white/70 mb-8">Fill out the contact form and we'll get back to you within 48 hours.</p>
          <Link to="/contact" className="btn-primary text-lg px-10 py-4">Book Now</Link>
        </div>
      </section>
    </>
  );
}
