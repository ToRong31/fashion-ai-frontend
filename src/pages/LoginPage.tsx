import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch {
      setError(isRegister ? 'Registration failed. Username may already exist.' : 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl text-text-primary text-center mb-8">
        {isRegister ? 'Create Account' : 'Sign In'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold/50"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-bg py-3 rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
        </button>

        <p className="text-text-secondary text-sm text-center mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            className="text-gold hover:text-gold-light transition-colors"
          >
            {isRegister ? 'Sign In' : 'Create one'}
          </button>
        </p>

        {!isRegister && (
          <p className="text-text-secondary text-xs text-center">
            Demo: <span className="text-text-primary">demo_user</span> / <span className="text-text-primary">demo123</span>
          </p>
        )}
      </form>
    </div>
  );
}
