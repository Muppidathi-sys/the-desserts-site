import { useStore } from '../store';
import { formatPrice } from '../utils/format';
import { Order } from '../types';

export function Reports() {
  const { orders } = useStore();

  // Calculate today's orders
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => 
    order.created_at.startsWith(today)
  );

  // Calculate sales metrics with payment methods
  const calculateMetrics = (ordersList: Order[]) => {
    const completedOrders = ordersList.filter(order => order.status === 'completed');
    const cashOrders = completedOrders.filter(order => order.payment_method === 'cash');
    const gpayOrders = completedOrders.filter(order => order.payment_method === 'gpay');

    return {
      totalSales: completedOrders.reduce((sum, order) => sum + order.total_amount, 0),
      totalOrders: completedOrders.length,
      averageOrderValue: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.total_amount, 0) / completedOrders.length 
        : 0,
      cashSales: cashOrders.reduce((sum, order) => sum + order.total_amount, 0),
      cashOrders: cashOrders.length,
      gpaySales: gpayOrders.reduce((sum, order) => sum + order.total_amount, 0),
      gpayOrders: gpayOrders.length
    };
  };

  const todayMetrics = calculateMetrics(todayOrders);
  const allTimeMetrics = calculateMetrics(orders);

  // Get popular items
  const popularItems = orders.reduce((items: Record<string, number>, order) => {
    order.items.forEach(item => {
      if (!items[item.name]) items[item.name] = 0;
      items[item.name] += item.quantity;
    });
    return items;
  }, {});

  const topItems = Object.entries(popularItems)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Add proper type for the sorting
  const sortedOrders = [...orders].sort((a: Order, b: Order) => 
    Number(b.total_amount) - Number(a.total_amount)
  );

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">Today's Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Total Sales</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {formatPrice(todayMetrics.totalSales)}
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Orders</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {todayMetrics.totalOrders}
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Average Order</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {formatPrice(todayMetrics.averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-success">payments</span>
              <p className="text-secondary-light text-sm">Cash Payments</p>
            </div>
            <p className="text-lg font-semibold text-success">
              {formatPrice(todayMetrics.cashSales)}
            </p>
            <p className="text-sm text-secondary-light mt-1">
              {todayMetrics.cashOrders} orders
            </p>
          </div>
          <div className="p-4 bg-info/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-info">phone_android</span>
              <p className="text-secondary-light text-sm">GPay Payments</p>
            </div>
            <p className="text-lg font-semibold text-info">
              {formatPrice(todayMetrics.gpaySales)}
            </p>
            <p className="text-sm text-secondary-light mt-1">
              {todayMetrics.gpayOrders} orders
            </p>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">Popular Items</h2>
        <div className="space-y-3">
          {topItems.map(([name, quantity]) => (
            <div key={name} className="flex justify-between items-center">
              <span className="text-secondary">{name}</span>
              <span className="text-primary font-medium">{quantity} sold</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Time Stats */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">All Time Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Total Revenue</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {formatPrice(allTimeMetrics.totalSales)}
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Total Orders</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {allTimeMetrics.totalOrders}
            </p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-secondary-light text-sm">Average Order</p>
            <p className="text-xl font-semibold text-primary mt-1">
              {formatPrice(allTimeMetrics.averageOrderValue)}
            </p>
          </div>
        </div>

        {/* All Time Payment Method Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-success">payments</span>
              <p className="text-secondary-light text-sm">Total Cash</p>
            </div>
            <p className="text-lg font-semibold text-success">
              {formatPrice(allTimeMetrics.cashSales)}
            </p>
            <p className="text-sm text-secondary-light mt-1">
              {allTimeMetrics.cashOrders} orders
            </p>
          </div>
          <div className="p-4 bg-info/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-info">phone_android</span>
              <p className="text-secondary-light text-sm">Total GPay</p>
            </div>
            <p className="text-lg font-semibold text-info">
              {formatPrice(allTimeMetrics.gpaySales)}
            </p>
            <p className="text-sm text-secondary-light mt-1">
              {allTimeMetrics.gpayOrders} orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 