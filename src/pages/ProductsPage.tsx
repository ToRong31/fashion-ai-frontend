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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-heading text-3xl text-text-primary mb-8">Collection</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold/50"
          />
        </div>
      </form>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? 'bg-gold text-bg'
                : 'bg-surface border border-border text-text-secondary hover:border-gold/40 hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-text-secondary">Loading...</div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}
