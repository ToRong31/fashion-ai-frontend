import { Link, NavLink } from 'react-router';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
  }`;

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-bold text-primary tracking-wide">
          ToRoMe
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid place-items-center w-10 h-10 rounded-full text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-0.5">
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-text-primary font-medium">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-primary-soft text-primary">
                  <User size={14} />
                </span>
                {user.username}
              </span>
              <button
                onClick={logout}
                aria-label="Log out"
                className="grid place-items-center w-10 h-10 rounded-full text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
            >
              <User size={15} /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
