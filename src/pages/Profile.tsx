import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { FaUser, FaPhone, FaCalendar, FaSignOutAlt } from 'react-icons/fa';
import { MdEmail, MdWork } from 'react-icons/md';

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .single();

          if (userData) {
            setUser(userData);
            // Fetch avatar if exists
            if (userData.avatar_url) {
              const { data } = await supabase.storage
                .from('avatars')
                .download(userData.avatar_url);
              if (data) {
                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-primary/10" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-[20px] font-semibold text-secondary">
                {user.username}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>

            {/* Contact & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-secondary-light">
                <FaPhone className="text-[14px]" />
                <span className="text-[14px]">{user.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-3 text-secondary-light">
                <MdEmail className="text-[14px]" />
                <span className="text-[14px]">{user.email || 'No email added'}</span>
              </div>
              <div className="flex items-center gap-3 text-secondary-light">
                <MdWork className="text-[14px]" />
                <span className="text-[14px] capitalize">{user.role} Account</span>
              </div>
              <div className="flex items-center gap-3 text-secondary-light">
                <FaCalendar className="text-[14px]" />
                <span className="text-[14px]">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-[14px]" />
          <span className="text-[14px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
} 