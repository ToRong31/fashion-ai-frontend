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
      setError(
        isRegister
          ? 'Registration failed. Username may already exist.'
          : 'Invalid username or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition';

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl text-text-primary mb-2">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isRegister
            ? 'Join ToRoMe and let the AI stylist help you shop.'
            : 'Sign in to continue shopping with ToRoMe.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-3xl p-7 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading
            ? isRegister
              ? 'Creating account…'
              : 'Signing in…'
            : isRegister
              ? 'Create Account'
              : 'Sign In'}
        </button>

        <p className="text-text-secondary text-sm text-center pt-1">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            {isRegister ? 'Sign In' : 'Create one'}
          </button>
        </p>

        {!isRegister && (
          <p className="text-text-secondary text-xs text-center bg-surface-soft rounded-lg px-3 py-2">
            Demo account — <span className="text-text-primary font-medium">demo_user</span> /{' '}
            <span className="text-text-primary font-medium">demo123</span>
          </p>
        )}
      </form>
    </div>
  );
}
