import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

const credentials = [
  { icon: '🎓', label: '18+ Years in Education' },
  { icon: '📚', label: 'Published Author' },
  { icon: '🎤', label: 'Keynote Speaker' },
  { icon: '💡', label: 'Certified Mentor & Consultant' },
  { icon: '❤️', label: 'Single Parent Advocate' },
  { icon: '🏆', label: 'Community Leader' },
];

export default function About() {
  return (
    <>
      <Helmet><title>About Natalie Cabinda | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="About Natalie Cabinda" subtitle="Educator · Author · Mentor · Speaker" />

      {/* Bio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Photo placeholder */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-primary to-accent-dark rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-8xl mb-6">👩‍💼</div>
                    <h3 className="font-heading text-2xl font-bold">Natalie Cabinda</h3>
                    <p className="text-accent mt-2">Author & Educator</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent text-white px-6 py-4 rounded-xl shadow-lg">
                  <p className="font-bold text-2xl">18+</p>
                  <p className="text-xs uppercase tracking-wide">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div>
              <p className="section-subtitle">Her Story</p>
              <h2 className="section-title">A Journey of Rebuilding</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Natalie Cabinda is an educator, author, mentor, speaker, and consultant whose life work is rooted in a simple but powerful conviction:
                  broken families can rebuild — and rebuild beautifully.
                </p>
                <p>
                  Drawing from more than 18 years of experience in education and her own personal journey through divorce and single parenting,
                  Natalie brings both professional credibility and lived authenticity to every conversation, every workshop, and every page she writes.
                </p>
                <p>
                  Her approach is grounded in the belief that single parents are not defined by what fell apart, but by what they choose to build next.
                  She specializes in individual growth, academic support, adversity recovery, post-divorce transition, and the cultivation of support networks
                  that sustain families through hard seasons.
                </p>
                <p>
                  Through her books, speaking engagements, and one-on-one consulting, Natalie has helped countless families find their footing —
                  and discover that the life they are building after divorce can be richer, more intentional, and more meaningful than the one they left behind.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">Work with Natalie</Link>
                <Link to="/public-speaking" className="btn-outline">Book a Speaking Event</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="section-title mb-10">Credentials & Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {credentials.map((c) => (
              <div key={c.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-accent transition-colors">
                <div className="text-4xl mb-3">{c.icon}</div>
                <p className="font-semibold text-primary text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="section-subtitle text-accent">Mission</p>
          <blockquote className="font-heading text-2xl md:text-3xl italic leading-relaxed mb-6">
            "My mission is to share strategies that will enable broken families to rebuild after divorce —
            with hope, with dignity, and with the confidence that a better tomorrow is always within reach."
          </blockquote>
          <p className="text-accent font-semibold">— Natalie Cabinda</p>
        </div>
      </section>
    </>
  );
}
