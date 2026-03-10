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
    getProduct(Number(id)).then((p) => {
      setProduct(p);
      setLoading(false);
    }).catch(() => setLoading(false));
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
    return <div className="max-w-7xl mx-auto px-6 py-16 text-center text-text-secondary">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-text-secondary mb-4">Product not found.</p>
        <Link to="/products" className="text-gold hover:text-gold-light">Back to Collection</Link>
      </div>
    );
  }

  const meta = product.metadata;
  const sizes = meta?.sizes_available ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm mb-8">
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
          <span className="text-white/30 text-lg uppercase tracking-widest">{meta?.color ?? 'product'}</span>
        </div>

        {/* Details */}
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-widest mb-2">{meta?.category ?? 'fashion'}</p>
          <h1 className="font-heading text-3xl text-text-primary mb-4">{product.name}</h1>
          <p className="text-gold font-heading text-2xl mb-6">${product.price.toFixed(2)}</p>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Metadata */}
          {meta && (
            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
              {meta.color && (
                <div className="bg-surface border border-border rounded-lg px-3 py-2">
                  <span className="text-text-secondary text-xs uppercase">Color</span>
                  <p className="text-text-primary capitalize">{meta.color}</p>
                </div>
              )}
              {meta.material && (
                <div className="bg-surface border border-border rounded-lg px-3 py-2">
                  <span className="text-text-secondary text-xs uppercase">Material</span>
                  <p className="text-text-primary capitalize">{meta.material}</p>
                </div>
              )}
              {meta.style && (
                <div className="bg-surface border border-border rounded-lg px-3 py-2">
                  <span className="text-text-secondary text-xs uppercase">Style</span>
                  <p className="text-text-primary capitalize">{meta.style}</p>
                </div>
              )}
              {meta.gender && (
                <div className="bg-surface border border-border rounded-lg px-3 py-2">
                  <span className="text-text-secondary text-xs uppercase">Gender</span>
                  <p className="text-text-primary capitalize">{meta.gender}</p>
                </div>
              )}
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                Select Size {selectedSize && <span className="text-gold normal-case">— {selectedSize}</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 rounded border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-border text-text-primary hover:border-gold/40'
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-gold/40 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-text-primary text-base w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-gold/40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className="text-text-secondary text-xs mb-4">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </p>

          {addError && <p className="text-red-400 text-sm mb-3">{addError}</p>}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className="w-full bg-gold text-bg py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? (
              <><Check size={18} /> Added to Cart</>
            ) : (
              <><ShoppingBag size={18} /> Add to Cart</>
            )}
          </button>

          {!user && (
            <p className="text-text-secondary text-xs text-center mt-2">
              You need to{' '}
              <Link to="/login" className="text-gold hover:text-gold-light">sign in</Link>
              {' '}to add items to cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

