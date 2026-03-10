import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { checkoutFromCart, getPaymentLink } from '../api/orders';
import CartItem from '../components/cart/CartItem';

export default function CartPage() {
  const { items, isLoading, fetchCart, totalAmount } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load cart from backend whenever user is available
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user, fetchCart]);

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutState('loading');
    setError(null);

    try {
      // Create order from cart (backend clears cart on success)
      const order = await checkoutFromCart(user.id);
      const payment = await getPaymentLink(order.id);
      setPaymentUrl(payment.payment_url);
      setCheckoutState('done');
      // Refresh local cart state (should be empty now)
      await fetchCart(user.id);
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <Loader2 size={32} className="mx-auto text-gold animate-spin mb-4" />
        <p className="text-text-secondary">Loading cart...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-text-secondary mb-4" />
        <h2 className="font-heading text-2xl text-text-primary mb-2">Please sign in</h2>
        <p className="text-text-secondary mb-6">Sign in to view and manage your cart.</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors">
          Sign In
        </Link>
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
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-text-secondary">Total</span>
          <span className="font-heading text-2xl text-gold">${totalAmount().toFixed(2)}</span>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={checkoutState === 'loading'}
          className="w-full bg-gold text-bg py-3 rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {checkoutState === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" /> Processing...</>
          ) : (
            'Checkout'
          )}
        </button>
      </div>
    </div>
  );
}

