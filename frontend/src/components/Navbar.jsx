import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Business',
    children: [
      { label: 'Public Speaking', path: '/public-speaking' },
      { label: 'The Boutique', path: '/the-boutique' },
      { label: 'Auction Items', path: '/auction-items' },
    ],
  },
  { label: 'RRR Non Profit', path: '/rrr-non-profit' },
  { label: 'Signed Books', path: '/signed-books' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [location]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary shadow-xl' : 'bg-primary/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-accent font-heading font-bold text-xl tracking-wide">Regroup</span>
              <span className="text-white text-xs tracking-widest uppercase">Refocus · Rebuild</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <button className="text-white/90 hover:text-accent px-3 py-2 text-sm font-semibold flex items-center gap-1 transition-colors">
                    {item.label}
                    <svg className="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 bg-primary-dark border-t-2 border-accent min-w-[180px] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.children.map((child) => (
                      <Link key={child.path} to={child.path}
                        className="block px-4 py-3 text-sm text-white/80 hover:text-accent hover:bg-primary-light transition-colors border-b border-white/10">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.path} to={item.path}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    location.pathname === item.path ? 'text-accent' : 'text-white/90 hover:text-accent'
                  }`}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 rounded" aria-label="Toggle menu">
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary-dark border-t border-white/10">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className="w-full text-left px-6 py-3 text-white/90 hover:text-accent font-semibold flex justify-between items-center border-b border-white/10">
                  {item.label}
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {openDropdown === item.label && item.children.map((child) => (
                  <Link key={child.path} to={child.path}
                    className="block pl-10 pr-6 py-3 text-sm text-white/70 hover:text-accent border-b border-white/10">
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.path} to={item.path}
                className="block px-6 py-3 text-white/90 hover:text-accent font-semibold border-b border-white/10">
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
