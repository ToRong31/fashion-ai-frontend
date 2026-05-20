import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { getProduct } from '../api/products';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import type { Product } from '../types/product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!id) return;
    getProduct(Number(id))
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const sizes = product.metadata?.sizes_available ?? [];
    if (sizes.length > 0 && !selectedSize) {
      setAddError('Please select a size.');
      return;
    }
    setAddError(null);
    try {
      await addItem({
        user_id: user.id,
        product_id: product.id,
        size: selectedSize,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setAddError('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-text-secondary mb-4">Product not found.</p>
        <Link to="/products" className="text-primary font-medium hover:text-primary-dark">
          Back to Collection
        </Link>
      </div>
    );
  }

  const meta = product.metadata;
  const sizes = meta?.sizes_available ?? [];
  const inStock = product.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
        {/* Image placeholder */}
        <div className="relative aspect-[3/4] rounded-3xl bg-gradient-to-br from-primary-soft via-surface-soft to-surface-soft overflow-hidden">
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl" />
          <span className="absolute inset-0 flex items-center justify-center font-heading text-2xl text-text-secondary/40 capitalize">
            {meta?.color ?? 'product'}
          </span>
        </div>

        {/* Details */}
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-widest mb-2">
            {meta?.category ?? 'fashion'}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl text-text-primary mb-3">
            {product.name}
          </h1>
          <p className="text-primary font-heading text-3xl mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Metadata */}
          {meta && (
            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
              {meta.color && (
                <div className="bg-surface border border-border rounded-xl px-3.5 py-2.5">
                  <span className="text-text-secondary text-[11px] uppercase tracking-wider">Color</span>
                  <p className="text-text-primary capitalize font-medium">{meta.color}</p>
                </div>
              )}
              {meta.material && (
                <div className="bg-surface border border-border rounded-xl px-3.5 py-2.5">
                  <span className="text-text-secondary text-[11px] uppercase tracking-wider">Material</span>
                  <p className="text-text-primary capitalize font-medium">{meta.material}</p>
                </div>
              )}
              {meta.style && (
                <div className="bg-surface border border-border rounded-xl px-3.5 py-2.5">
                  <span className="text-text-secondary text-[11px] uppercase tracking-wider">Style</span>
                  <p className="text-text-primary capitalize font-medium">{meta.style}</p>
                </div>
              )}
              {meta.gender && (
                <div className="bg-surface border border-border rounded-xl px-3.5 py-2.5">
                  <span className="text-text-secondary text-[11px] uppercase tracking-wider">Gender</span>
                  <p className="text-text-primary capitalize font-medium">{meta.gender}</p>
                </div>
              )}
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                Select Size{' '}
                {selectedSize && <span className="text-primary normal-case">— {selectedSize}</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-border bg-surface text-text-primary hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-6">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">Quantity</p>
            <div className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="text-text-primary text-base w-9 text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className="flex items-center gap-1.5 text-xs mb-4">
            <span
              className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-400'}`}
            />
            <span className="text-text-secondary">
              {inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span>
          </p>

          {addError && <p className="text-red-500 text-sm mb-3">{addError}</p>}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {added ? (
              <>
                <Check size={18} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={18} /> Add to Cart
              </>
            )}
          </button>

          {!user && (
            <p className="text-text-secondary text-xs text-center mt-3">
              You need to{' '}
              <Link to="/login" className="text-primary font-medium hover:text-primary-dark">
                sign in
              </Link>{' '}
              to add items to your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
