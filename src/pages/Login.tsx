import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';
import { showToast } from '../utils/toast';

export function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Then fetch the user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .maybeSingle(); // Use maybeSingle instead of single

      if (userError) throw userError;
      
      if (!userData) {
        throw new Error('User profile not found');
      }

      setUser(userData);
      showToast.success('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      showToast.error('Login failed. Please check your credentials.');
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
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your email"
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
              name="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

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