import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { formatPrice } from '../utils/format';
import { EmptyState } from '../components/EmptyState';
import { BsBarChartLine } from 'react-icons/bs';

type TimeFrame = 'today' | 'week' | 'month' | 'year';

export function Reports() {
  const { orders } = useStore();
  const [timeframe, setTimeframe] = useState<TimeFrame>('today');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      switch (timeframe) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= weekAgo;
        case 'month':
          return orderDate >= monthAgo;
        case 'year':
          return orderDate >= yearAgo;
        default:
          return true;
      }
    });
  }, [orders, timeframe]);

  // Calculate metrics based on filtered orders
  const metrics = useMemo(() => {
    const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
    const cashOrders = completedOrders.filter(order => order.payment_method === 'cash');
    const gpayOrders = completedOrders.filter(order => order.payment_method === 'gpay');

    return {
      totalSales: completedOrders.reduce((sum, order) => sum + order.total_amount, 0),
      totalOrders: filteredOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      cashSales: cashOrders.reduce((sum, order) => sum + order.total_amount, 0),
      cashOrders: cashOrders.length,
      gpaySales: gpayOrders.reduce((sum, order) => sum + order.total_amount, 0),
      gpayOrders: gpayOrders.length,
      averageOrderValue: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.total_amount, 0) / completedOrders.length 
        : 0
    };
  }, [filteredOrders]);

  // Get popular items
  const popularItems = filteredOrders
    .filter(order => order.status === 'completed')
    .reduce((acc, order) => {
      order.order_items.forEach(item => {
        if (!acc[item.name]) acc[item.name] = { quantity: 0, revenue: 0 };
        acc[item.name].quantity += item.quantity;
        acc[item.name].revenue += item.subtotal;
      });
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);

  const topItems = Object.entries(popularItems)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-4">
      {/* Time Filter */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-[14px] ${
                timeframe === period
                  ? 'bg-primary text-white'
                  : 'text-secondary-light hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl">
          <h3 className="text-[12px] text-secondary-light">Total Sales</h3>
          <p className="text-[20px] font-semibold text-primary mt-1">
            {formatPrice(metrics.totalSales)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-secondary-light">
              {metrics.completedOrders} orders
            </span>
            <span className="text-[12px] text-success">
              Avg: {formatPrice(metrics.averageOrderValue)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <h3 className="text-[12px] text-secondary-light">Orders Status</h3>
          <p className="text-[20px] font-semibold text-primary mt-1">
            {metrics.totalOrders}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-success">
              {metrics.completedOrders} completed
            </span>
            <span className="text-[12px] text-red-500">
              {metrics.cancelledOrders} cancelled
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <h3 className="text-[12px] text-secondary-light">Cash Payments</h3>
          <p className="text-[20px] font-semibold text-primary mt-1">
            {formatPrice(metrics.cashSales)}
          </p>
          <p className="text-[12px] text-secondary-light mt-2">
            {metrics.cashOrders} orders
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <h3 className="text-[12px] text-secondary-light">GPay Payments</h3>
          <p className="text-[20px] font-semibold text-primary mt-1">
            {formatPrice(metrics.gpaySales)}
          </p>
          <p className="text-[12px] text-secondary-light mt-2">
            {metrics.gpayOrders} orders
          </p>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-xl p-4">
        <h2 className="text-[16px] font-medium text-secondary mb-4">
          Popular Items
        </h2>
        <div className="space-y-3">
          {topItems.map(([name, data]) => (
            <div key={name} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <div>
                <span className="text-[14px] text-secondary">{name}</span>
                <p className="text-[12px] text-secondary-light">
                  Revenue: {formatPrice(data.revenue)}
                </p>
              </div>
              <span className="text-[14px] text-primary font-medium">
                {data.quantity} sold
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 