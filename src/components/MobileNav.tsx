import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { FaHome } from 'react-icons/fa';
import { BiHistory } from 'react-icons/bi';
import { IoStatsChart } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { Logo } from './Logo';

export function MobileNav() {
  const location = useLocation();
  const { user } = useStore();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 lg:hidden z-10">
        <div className="px-4 py-3">
          <Logo />
        </div>
      </header>

      {/* Floating Action Button */}
      {location.pathname === '/' && (
        <Link
          to="/new-order"
          className="fixed bottom-20 right-4 bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center z-10"
        >
          <span className="material-icons text-2xl">add</span>
        </Link>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" icon={<FaHome />} label="Orders" />
          <NavLink to="/history" icon={<BiHistory />} label="History" />
          {user?.role === 'manager' && (
            <NavLink to="/reports" icon={<IoStatsChart />} label="Reports" />
          )}
          <NavLink to="/profile" icon={<CgProfile />} label="Profile" />
        </div>
      </div>
    </>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-16 ${
        isActive(to) ? 'text-primary' : 'text-secondary-light'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
} 