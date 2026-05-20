import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getProducts, vectorSearch } from '../api/products';
import type { Product } from '../types/product';
import ProductGrid from '../components/product/ProductGrid';

const CATEGORIES = ['all', 'outerwear', 'tops', 'bottoms', 'dresses', 'shoes', 'accessories'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.products);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      getProducts().then((res) => setProducts(res.products));
      return;
    }
    setLoading(true);
    vectorSearch(searchQuery.trim(), 16).then((res) => {
      setProducts(res.products);
      setActiveCategory('all');
      setLoading(false);
    });
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.metadata?.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-text-primary">Collection</h1>
        <p className="text-text-secondary text-sm mt-1.5">
          Browse the full range, or search for exactly what you have in mind.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-lg">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try “navy blazer” or “something for a date”…"
            className="w-full bg-surface border border-border rounded-full pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition"
          />
        </div>
      </form>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="aspect-[3/4] bg-surface-soft animate-pulse" />
              <div className="p-4 space-y-2.5">
                <div className="h-3.5 bg-surface-soft rounded animate-pulse" />
                <div className="h-3.5 w-1/3 bg-surface-soft rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-text-secondary text-xs mb-4">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </p>
          <ProductGrid products={filtered} />
        </>
      )}
    </div>
  );
}
