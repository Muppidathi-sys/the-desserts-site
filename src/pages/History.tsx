import { useState } from 'react';
import { useStore } from '../store';
import { BsSearch, BsClockHistory } from 'react-icons/bs';
import { EmptyState } from '../components/EmptyState';

export function History() {
  const { orders, loading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const completedOrders = orders
    .filter(order => {
      // Only show completed and cancelled orders
      if (!['completed', 'cancelled'].includes(order.status)) return false;

      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          order.order_number.toLowerCase().includes(searchLower) ||
          order.order_items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-icons animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {completedOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm">
            <EmptyState
              title="No order history"
              message={
                searchQuery
                  ? "No orders found matching your search."
                  : "No completed orders to show in the history."
              }
              icon={<BsClockHistory className="text-4xl text-primary/60" />}
            />
          </div>
        ) : (
          completedOrders.map(order => (
            <div key={order.order_id} className="bg-white rounded-lg shadow-sm">
              {/* Order Header */}
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">#{order.order_number}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {/* Order Items */}
              <div className="p-4 space-y-2">
                {order.order_items?.map(item => (
                  <div key={item.order_item_id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-gray-50 rounded-b-lg">
                <p className="text-lg font-medium">
                  Total: ₹{order.total_amount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 