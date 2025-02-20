import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export function Navigation() {
  const location = useLocation();
  const { user } = useStore();

  const navigationItems = [
    {
      to: '/',
      icon: 'receipt_long',
      label: 'Orders',
      show: true
    },
    {
      to: '/history',
      icon: 'history',
      label: 'History',
      show: true
    },
    {
      to: '/reports',
      icon: 'analytics',
      label: 'Reports',
      show: true
    },
    {
      to: '/users',
      icon: 'people',
      label: 'Staff',
      show: user?.role === 'manager'
    },
    {
      to: '/profile',
      icon: 'person',
      label: 'Profile',
      show: true
    }
  ];

  return (
    <nav className="flex flex-col gap-1">
      {navigationItems
        .filter(item => item.show)
        .map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              location.pathname === item.to
                ? 'bg-primary text-white'
                : 'text-secondary-light hover:bg-gray-50'
            }`}
          >
            <span className="material-icons">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
    </nav>
  );
} 