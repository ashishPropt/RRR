import { Link } from 'react-router-dom';

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { name: 'Instagram', href: 'https://instagram.com', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 20.5h9a3 3 0 003-3v-9a3 3 0 00-3-3h-9a3 3 0 00-3 3v9a3 3 0 003 3z' },
  { name: 'Yelp', href: 'https://yelp.com', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-heading text-2xl font-bold text-accent mb-3">Regroup Refocus Rebuild</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Helping single parents navigate life after divorce with practical strategies,
            community support, and the belief that a better future is always possible.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold text-white uppercase tracking-widest text-xs mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              ['Home', '/'],
              ['About', '/about'],
              ['Public Speaking', '/public-speaking'],
              ['The Boutique', '/the-boutique'],
              ['Auction', '/auction-items'],
              ['Blog', '/blog'],
              ['Contact', '/contact'],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="text-white/60 hover:text-accent text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & social */}
        <div>
          <h4 className="font-semibold text-white uppercase tracking-widest text-xs mb-4">Get in Touch</h4>
          <a href="mailto:nataliecabinda@gmail.com" className="text-accent hover:text-accent-light text-sm block mb-4 transition-colors">
            nataliecabinda@gmail.com
          </a>
          <div className="flex gap-3 mt-2">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.name}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} Regroup Refocus Rebuild. All rights reserved.
      </div>
    </footer>
  );
}
