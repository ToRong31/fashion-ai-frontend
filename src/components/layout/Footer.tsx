import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-soft">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-heading text-primary text-xl font-bold mb-2">ToRoMe</p>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Curated fashion with a personal AI stylist — find pieces you'll love, effortlessly.
            </p>
          </div>

          <div>
            <p className="text-text-primary font-semibold text-sm mb-3">Explore</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-text-secondary hover:text-primary transition-colors">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-text-secondary hover:text-primary transition-colors">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-text-primary font-semibold text-sm mb-3">Need a hand?</p>
            <p className="text-text-secondary text-sm leading-relaxed flex items-start gap-2">
              <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
              Ask our AI assistant anytime — just tap the chat bubble in the corner.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-text-secondary text-xs">
          &copy; {new Date().getFullYear()} ToRoMe Store. Made with care.
        </div>
      </div>
    </footer>
  );
}
