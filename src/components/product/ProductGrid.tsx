import { PackageOpen } from 'lucide-react';
import type { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="grid place-items-center w-14 h-14 rounded-2xl bg-surface-soft text-text-secondary mx-auto mb-4">
          <PackageOpen size={26} />
        </div>
        <p className="text-text-primary font-medium">No products found</p>
        <p className="text-text-secondary text-sm mt-1">Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
