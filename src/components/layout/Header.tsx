import { Link } from 'react-router';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-bold text-gold tracking-wider">
          ToRoMe
        </Link>

        <nav className="flex items-center gap-8">
          <Link to="/products" className="text-text-secondary hover:text-text-primary transition-colors text-sm uppercase tracking-widest">
            Collection
          </Link>

          <Link to="/cart" className="relative text-text-secondary hover:text-text-primary transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-bg text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-text-secondary text-sm">{user.username}</span>
              <button onClick={logout} className="text-text-secondary hover:text-text-primary transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors">
              <User size={20} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
