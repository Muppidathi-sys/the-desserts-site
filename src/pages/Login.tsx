import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First check if user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        throw new Error('Invalid username or password');
      }

      // Then sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`, // Use a consistent email format
        password: password
      });

      if (authError) throw authError;

      console.log('Logged in user:', userData);
      setUser(userData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-primary/5" style={{ opacity: 0.8 }}>
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="mb-8 scale-125 relative z-10">
        <Logo />
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-card w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <p className="text-secondary-light">
            Sign in to manage orders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary-light text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-secondary-light text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
    </div>
  );
} 