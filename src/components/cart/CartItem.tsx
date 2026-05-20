import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="w-16 h-20 rounded-xl bg-surface-soft flex-shrink-0 flex items-center justify-center">
        <span className="text-text-secondary text-xs font-medium uppercase">
          {item.size ?? '—'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-text-primary text-sm font-medium truncate">{item.product_name}</h4>
        {item.size && <p className="text-text-secondary text-xs mt-0.5">Size: {item.size}</p>}
        <p className="text-text-secondary text-xs mt-0.5">${item.price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-0.5">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={13} />
        </button>
        <span className="text-text-primary text-sm w-6 text-center font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={13} />
        </button>
      </div>

      <p className="text-text-primary text-sm w-20 text-right font-semibold">
        ${item.total_price.toFixed(2)}
      </p>

      <button
        onClick={() => removeItem(item.id)}
        className="grid place-items-center w-8 h-8 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
