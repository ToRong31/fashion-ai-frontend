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
  if (!color) return 'from-stone-300 to-stone-200';
  return COLOR_GRADIENTS[color.toLowerCase()] ?? 'from-stone-300 to-stone-200';
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const color = product.metadata?.color;
  const gradient = getGradient(color);

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_30px_-10px_rgba(60,40,20,0.22)]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
          <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm text-text-secondary text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            {product.metadata?.category ?? 'fashion'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-text-primary font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-primary font-heading text-lg mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
