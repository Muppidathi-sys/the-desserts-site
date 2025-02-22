import { useLocation } from 'react-router-dom';

export function AppHeader() {
  const location = useLocation();
  const title = (() => {
    switch (location.pathname) {
      case '/':
        return 'Orders';
      case '/history':
        return 'Order History';
      case '/reports':
        return 'Reports';
      case '/profile':
        return 'Profile';
      default:
        return 'Food Cart Manager';
    }
  })();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="flex items-center px-4 h-14">
        <div className="flex items-center gap-3">
          <span className="material-icons text-primary text-2xl">
            restaurant
          </span>
          <h1 className="text-lg font-medium text-secondary">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
} 