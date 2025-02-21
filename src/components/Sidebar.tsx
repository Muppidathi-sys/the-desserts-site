import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Orders', icon: 'receipt_long' },
    { path: '/new-order', label: 'New Order', icon: 'add_circle' },
    { path: '/history', label: 'History', icon: 'history' },
    { path: '/reports', label: 'Reports', icon: 'bar_chart' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-100 hidden lg:block">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(({ path, label, icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-gray-50'
                }`}
              >
                <span className="material-icons">{icon}</span>
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 