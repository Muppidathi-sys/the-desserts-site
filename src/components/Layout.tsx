import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function Layout() {
  const location = useLocation();
  const isNewOrderPage = location.pathname === '/new-order';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isNewOrderPage && (
        <>
          <Sidebar />
          <MobileNav />
        </>
      )}
      <main className={`${
        isNewOrderPage 
          ? '' 
          : 'pt-16 pb-20 px-4 lg:pl-80 lg:p-8'
      }`}>
        <Outlet />
      </main>
    </div>
  );
} 