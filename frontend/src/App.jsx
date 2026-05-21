import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/public-speaking" element={<PublicSpeaking />} />
          <Route path="/the-boutique" element={<Boutique />} />
          <Route path="/auction-items" element={<AuctionItems />} />
          <Route path="/rrr-non-profit" element={<NonProfit />} />
          <Route path="/signed-books" element={<SignedBooks />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
