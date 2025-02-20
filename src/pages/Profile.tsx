import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (userData) {
          setUser(userData);
        }
      }
    };

    if (!user) {
      fetchUserProfile();
    }
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-primary/10 text-primary';
      case 'kitchen':
        return 'bg-yellow-100 text-yellow-800';
      case 'operator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-icons text-3xl text-primary">
              account_circle
            </span>
          </div>
          <div>
            <h1 className="text-xl font-medium text-secondary">
              {user.username}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              {user.phone && (
                <span className="text-secondary-light">
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <span className="material-icons text-sm">
          logout
        </span>
        Logout
      </button>
    </div>
  );
} 