import { Link } from 'react-router';
import type { Product } from '../../types/product';

const COLOR_GRADIENTS: Record<string, string> = {
  black: 'from-gray-900 to-gray-700',
  white: 'from-gray-100 to-gray-300',
  navy: 'from-blue-950 to-blue-800',
  blue: 'from-blue-800 to-blue-500',
  red: 'from-red-900 to-red-600',
  burgundy: 'from-red-950 to-red-800',
  green: 'from-green-900 to-green-600',
  olive: 'from-green-900 to-yellow-800',
  beige: 'from-amber-100 to-amber-300',
  cream: 'from-amber-50 to-amber-200',
  brown: 'from-amber-900 to-amber-700',
  camel: 'from-amber-700 to-amber-500',
  tan: 'from-amber-600 to-amber-400',
  gray: 'from-gray-600 to-gray-400',
  grey: 'from-gray-600 to-gray-400',
  silver: 'from-gray-400 to-gray-200',
  gold: 'from-yellow-600 to-yellow-400',
  pink: 'from-pink-700 to-pink-400',
  indigo: 'from-indigo-900 to-indigo-600',
};

function getGradient(color?: string): string {
  if (!color) return 'from-gray-800 to-gray-600';
  return COLOR_GRADIENTS[color.toLowerCase()] ?? 'from-gray-800 to-gray-600';
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const color = product.metadata?.color;
  const gradient = getGradient(color);

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-surface rounded-lg border border-border overflow-hidden hover:border-gold/40 transition-all duration-300">
        <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} flex items-end p-4`}>
          <span className="text-white/60 text-xs uppercase tracking-widest">
            {product.metadata?.category ?? 'fashion'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-text-primary font-medium text-sm group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gold font-heading text-lg mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
