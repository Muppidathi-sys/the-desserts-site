import { Outlet, useLocation } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Logo } from './Logo';

export function Layout() {
  const location = useLocation();
  const isNewOrderPage = location.pathname === '/new-order';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isNewOrderPage && (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <Logo />
            </div>
          </div>
        </header>
      )}
      
      <main className={`${!isNewOrderPage ? 'pt-20' : ''} pb-24`}>
        <div className="px-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {!isNewOrderPage && (
        <MobileNav />
      )}
    </div>
  );
} 