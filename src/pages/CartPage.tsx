import { useState } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { autoCreateOrder, getPaymentLink } from '../api/orders';
import CartItem from '../components/cart/CartItem';

export default function CartPage() {
  const { items, totalAmount, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutState('loading');
    setError(null);

    try {
      const productIds = items.map((i) => i.product.id);
      const order = await autoCreateOrder({ user_id: user.id, product_ids: productIds });

      const payment = await getPaymentLink(order.id);
      setPaymentUrl(payment.payment_url);
      setCheckoutState('done');
      clear();
    } catch {
      setError('Failed to create order. Please try again.');
      setCheckoutState('idle');
    }
  };

  if (checkoutState === 'done' && paymentUrl) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-surface border border-border rounded-xl p-8">
          <ShoppingBag size={48} className="mx-auto text-gold mb-4" />
          <h2 className="font-heading text-2xl text-text-primary mb-2">Order Created!</h2>
          <p className="text-text-secondary mb-6">Your order has been placed. Proceed to payment below.</p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            Pay with VNPay <ExternalLink size={16} />
          </a>
          <Link to="/products" className="block mt-4 text-gold text-sm hover:text-gold-light">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-text-secondary mb-4" />
        <h2 className="font-heading text-2xl text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-6">Discover our collection and find your perfect style.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-heading text-3xl text-text-primary mb-8">Shopping Cart</h1>

      <div className="mb-8">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-text-secondary">Total</span>
          <span className="font-heading text-2xl text-gold">${totalAmount().toFixed(2)}</span>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {user ? (
          <button
            onClick={handleCheckout}
            disabled={checkoutState === 'loading'}
            className="w-full bg-gold text-bg py-3 rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {checkoutState === 'loading' ? 'Processing...' : 'Checkout'}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-text-secondary text-sm mb-3">Please login to checkout</p>
            <Link to="/login" className="inline-block bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
