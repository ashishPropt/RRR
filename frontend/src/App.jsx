import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RequireAdmin from './components/RequireAdmin';
import { AdminProvider } from './context/AdminContext';

import Home from './pages/Home';
import About from './pages/About';
import PublicSpeaking from './pages/PublicSpeaking';
import Boutique from './pages/Boutique';
import AuctionItems from './pages/AuctionItems';
import NonProfit from './pages/NonProfit';
import SignedBooks from './pages/SignedBooks';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogForm from './pages/admin/AdminBlogForm';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <ScrollToTop />
      <Routes>
        {/* Admin routes — no Navbar/Footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <RequireAdmin><AdminDashboard /></RequireAdmin>
        } />
        <Route path="/admin/blog" element={
          <RequireAdmin><AdminBlogList /></RequireAdmin>
        } />
        <Route path="/admin/blog/new" element={
          <RequireAdmin><AdminBlogForm /></RequireAdmin>
        } />
        <Route path="/admin/blog/:id" element={
          <RequireAdmin><AdminBlogForm /></RequireAdmin>
        } />

        {/* Public routes — with Navbar/Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/public-speaking" element={<PublicLayout><PublicSpeaking /></PublicLayout>} />
        <Route path="/the-boutique" element={<PublicLayout><Boutique /></PublicLayout>} />
        <Route path="/auction-items" element={<PublicLayout><AuctionItems /></PublicLayout>} />
        <Route path="/rrr-non-profit" element={<PublicLayout><NonProfit /></PublicLayout>} />
        <Route path="/signed-books" element={<PublicLayout><SignedBooks /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
      </Routes>
    </AdminProvider>
  );
}
