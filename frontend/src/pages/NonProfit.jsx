import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { nonprofitApi } from '../services/api';

export default function NonProfit() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    nonprofitApi.getAll().then(r => setPrograms(r.data)).catch(() => {});
  }, []);

  const fallback = [
    { id: '1', name: 'Support for Single Parents', description: 'Providing resources, mentorship, and community connections to single parents navigating life after divorce. Our program offers workshops, one-on-one coaching, and a peer support network.', icon: '🤝' },
    { id: '2', name: "Children's Resilience Initiative", description: 'Age-appropriate programs designed to help children of divorce build emotional resilience, maintain academic performance, and develop healthy coping strategies.', icon: '🌱' },
    { id: '3', name: 'Community Rebuild Network', description: 'Building bridges between single-parent families and community resources — from legal aid to counseling to financial literacy. No family should rebuild alone.', icon: '🏘️' },
  ];

  const displayPrograms = programs.length > 0 ? programs : fallback;

  return (
    <>
      <Helmet><title>RRR Non Profit | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="RRR Non Profit" subtitle="Rebuilding Families Together" />

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="section-subtitle">Our Purpose</p>
          <h2 className="section-title">Why the RRR Non Profit Exists</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            The RRR Non Profit was founded on a foundational truth: single parents and their children should not have to navigate
            the aftermath of divorce without support, resources, and community.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            Through direct programs, community partnerships, and advocacy, we work to ensure that every family — regardless of
            economic circumstance — has access to the tools they need to regroup, refocus, and rebuild.
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold px-6 py-3 rounded-full border border-accent/30">
            🌟 Coming Soon — Registration Opening Shortly
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center mb-10">Our Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {displayPrograms.map((p) => (
              <div key={p.id} className="card p-8 text-center">
                <div className="text-5xl mb-4">{p.icon || '💪'}</div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">{p.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Our Vision for Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Families Supported' },
              { num: '1,000+', label: 'Children Served' },
              { num: '50+', label: 'Community Partners' },
              { num: '18+', label: 'Years of Expertise' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-heading text-4xl font-bold text-accent mb-2">{num}</p>
                <p className="text-white/70 text-sm uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title">Get Involved</h2>
          <p className="text-gray-600 mb-10">
            Whether you want to volunteer, donate, partner with us, or simply spread the word — there is a place for you in this mission.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💝', title: 'Donate', desc: 'Your contribution directly funds programs that serve single-parent families in need.', cta: 'Give Now', href: '/contact' },
              { icon: '🙋', title: 'Volunteer', desc: 'Bring your skills and heart to our workshops, mentorship programs, and community events.', cta: 'Get Involved', href: '/contact' },
              { icon: '🤲', title: 'Partner', desc: 'Organizations and businesses — join us as a community partner and amplify our collective impact.', cta: 'Partner With Us', href: '/contact' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-heading text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <Link to={item.href} className="btn-primary text-sm py-2">{item.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
