import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';
import ProductGrid from '../components/product/ProductGrid';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((res) => {
      setFeatured(res.products.slice(0, 8));
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary mb-6">
            Curated <span className="text-gold">Fashion</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover your style with AI-powered recommendations.
            Our intelligent assistant helps you find the perfect outfit.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gold text-bg px-8 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              Shop Collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl text-text-primary">Featured Pieces</h2>
            <Link to="/products" className="text-gold text-sm hover:text-gold-light transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>
    </div>
  );
}
