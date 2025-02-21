import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';

export function Layout() {
  // Enable real-time updates
  useRealtimeOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <main className="pt-16 pb-20 px-4 lg:pl-80 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
} 