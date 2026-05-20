import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-surface border border-border rounded-3xl p-10 text-center shadow-sm">
          <div className="grid place-items-center w-16 h-16 rounded-2xl bg-green-100 text-green-600 mx-auto mb-5">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-heading text-2xl text-text-primary mb-2">Order created!</h2>
          <p className="text-text-secondary mb-7">
            Your order has been placed. Just one more step — complete the payment below.
          </p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Pay with VNPay <ExternalLink size={16} />
          </a>
          <Link
            to="/products"
            className="block mt-5 text-primary text-sm font-medium hover:text-primary-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-4" />
        <p className="text-text-secondary">Loading cart…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-surface border border-border rounded-3xl p-10 text-center shadow-sm">
          <div className="grid place-items-center w-16 h-16 rounded-2xl bg-primary-soft text-primary mx-auto mb-5">
            <ShoppingBag size={30} />
          </div>
          <h2 className="font-heading text-2xl text-text-primary mb-2">Please sign in</h2>
          <p className="text-text-secondary mb-7">Sign in to view and manage your cart.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-surface border border-border rounded-3xl p-10 text-center shadow-sm">
          <div className="grid place-items-center w-16 h-16 rounded-2xl bg-surface-soft text-text-secondary mx-auto mb-5">
            <ShoppingBag size={30} />
          </div>
          <h2 className="font-heading text-2xl text-text-primary mb-2">Your cart is empty</h2>
          <p className="text-text-secondary mb-7">
            Discover our collection and find your perfect style.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-heading text-3xl text-text-primary mb-1">Shopping Cart</h1>
      <p className="text-text-secondary text-sm mb-8">
        {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout.
      </p>

      <div className="bg-surface border border-border rounded-2xl px-5 mb-6">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center text-sm text-text-secondary mb-2">
          <span>Subtotal</span>
          <span>${totalAmount().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border mb-6">
          <span className="text-text-primary font-medium">Total</span>
          <span className="font-heading text-2xl text-primary">
            ${totalAmount().toFixed(2)}
          </span>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={checkoutState === 'loading'}
          className="w-full bg-primary text-white py-3.5 rounded-full font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {checkoutState === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Processing…
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>
    </div>
  );
}
