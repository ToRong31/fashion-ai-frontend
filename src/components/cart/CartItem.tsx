import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem as CartItemType } from '../../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border">
      <div className="w-16 h-20 rounded bg-surface flex-shrink-0 flex items-center justify-center">
        <span className="text-text-secondary text-xs uppercase">{item.product.metadata?.color ?? '—'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-text-primary text-sm font-medium truncate">{item.product.name}</h4>
        <p className="text-gold text-sm mt-0.5">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="w-7 h-7 rounded border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-gold/40 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="text-text-primary text-sm w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="w-7 h-7 rounded border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-gold/40 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
      <p className="text-text-primary text-sm w-20 text-right font-medium">
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => removeItem(item.product.id)}
        className="text-text-secondary hover:text-red-400 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
