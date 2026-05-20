import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import ProductGrid from '../components/product/ProductGrid';
import { useChatStore } from '../stores/chatStore';

const PERKS = [
  {
    icon: Sparkles,
    title: 'AI Personal Stylist',
    text: "Tell us the occasion — get outfit ideas in seconds.",
  },
  {
    icon: RefreshCw,
    title: 'Easy 30-Day Returns',
    text: 'Changed your mind? Send it back, no questions asked.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    text: 'Pay safely with VNPay. Your details stay protected.',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const openChat = useChatStore((s) => s.toggleOpen);

  useEffect(() => {
    getProducts().then((res) => {
      setFeatured(res.products.slice(0, 8));
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-soft blur-3xl opacity-70" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-surface-soft blur-3xl opacity-80" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <span className="animate-fade-in-up inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-sm text-text-secondary mb-6">
            <Sparkles size={14} className="text-primary" /> Shopping, made personal
          </span>
          <h1 className="animate-fade-in-up font-heading text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-[1.1]">
            Find your<br />
            <span className="text-primary">perfect look</span>
          </h1>
          <p className="animate-fade-in-up text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover curated fashion with a friendly AI stylist by your side —
            helping you put together outfits you'll genuinely love.
          </p>
          <div className="animate-fade-in-up flex flex-wrap gap-3 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-medium hover:bg-primary-dark transition-colors shadow-sm"
            >
              Shop the Collection <ArrowRight size={18} />
            </Link>
            <button
              onClick={openChat}
              className="inline-flex items-center gap-2 bg-surface text-text-primary border border-border px-7 py-3.5 rounded-full font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <Sparkles size={18} /> Ask the AI Stylist
            </button>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-surface border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary-soft text-primary mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-heading text-lg text-text-primary mb-1">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-3xl text-text-primary">Featured Pieces</h2>
              <p className="text-text-secondary text-sm mt-1">
                Hand-picked favourites from our latest collection.
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary text-sm font-medium hover:text-primary-dark transition-colors flex items-center gap-1 flex-shrink-0"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>
    </div>
  );
}
