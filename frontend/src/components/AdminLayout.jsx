import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminLayout({ children }) {
  const { logout, username } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-accent text-white'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-white font-heading font-bold text-lg leading-tight">
            RRR Admin
          </div>
          <div className="text-white/50 text-xs mt-1">{username || 'Content Management'}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin/dashboard" className={navClass}>
            <span>📊</span> Dashboard
          </NavLink>

          <div className="pt-2 pb-1 px-2 text-white/30 text-xs uppercase tracking-widest">Blog</div>
          <NavLink to="/admin/blog" end className={navClass}>
            <span>📝</span> Blog Posts
          </NavLink>
          <NavLink to="/admin/blog/new" className={navClass}>
            <span>➕</span> New Post
          </NavLink>

          <div className="pt-2 pb-1 px-2 text-white/30 text-xs uppercase tracking-widest">Shop</div>
          <NavLink to="/admin/books" end className={navClass}>
            <span>📚</span> Books
          </NavLink>
          <NavLink to="/admin/books/new" className={navClass}>
            <span>➕</span> Add Book
          </NavLink>
          <NavLink to="/admin/products" end className={navClass}>
            <span>🛍️</span> Boutique Items
          </NavLink>
          <NavLink to="/admin/products/new" className={navClass}>
            <span>➕</span> Add Product
          </NavLink>

          <div className="pt-2 pb-1 px-2 text-white/30 text-xs uppercase tracking-widest">Orders</div>
          <NavLink to="/admin/orders" className={navClass}>
            <span>📦</span> Orders
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-3 transition-colors"
          >
            <span>🌐</span> View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
