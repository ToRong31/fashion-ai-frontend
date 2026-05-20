import { Link } from 'react-router';
import { useChatStore } from '../../stores/chatStore';

export interface ChatProduct {
  id: number;
  name: string;
  price: string;
  description: string;
  color?: string;
  category?: string;
}

const COLOR_GRADIENTS: Record<string, string> = {
  black: 'from-gray-900 to-gray-700',
  white: 'from-gray-100 to-gray-300',
  navy: 'from-blue-950 to-blue-800',
  blue: 'from-blue-800 to-blue-500',
  denim: 'from-blue-800 to-blue-500',
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
  blush: 'from-pink-300 to-pink-500',
  indigo: 'from-indigo-900 to-indigo-600',
};

function getGradient(color?: string, name?: string): string {
  if (color) {
    const g = COLOR_GRADIENTS[color.toLowerCase()];
    if (g) return g;
  }
  if (name) {
    const lower = name.toLowerCase();
    for (const [c, g] of Object.entries(COLOR_GRADIENTS)) {
      if (lower.includes(c)) return g;
    }
  }
  return 'from-stone-300 to-stone-200';
}

interface ChatProductCardProps {
  product: ChatProduct;
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const gradient = getGradient(product.color, product.name);
  const toggleOpen = useChatStore((s) => s.toggleOpen);

  return (
    <Link
      to={`/products/${product.id}`}
      onClick={toggleOpen}
      className="block rounded-xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200 group bg-surface"
    >
      {/* Product image */}
      <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} relative flex items-end p-2`}>
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
        <span className="relative text-white/70 text-[9px] uppercase tracking-widest">
          {product.category ?? 'fashion'}
        </span>
      </div>
      {/* Info */}
      <div className="px-2 py-1.5">
        <p className="text-[11px] font-medium text-text-primary group-hover:text-primary transition-colors truncate">
          {product.name}
        </p>
        <p className="text-[11px] font-heading text-primary">{product.price}</p>
      </div>
    </Link>
  );
}
