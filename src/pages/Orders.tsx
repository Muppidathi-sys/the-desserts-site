import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { OrderActions } from '../components/OrderActions';

type OrderFilter = 'active' | 'in_progress' | 'completed';

export function Orders() {
  const { orders, loading, fetchOrders } = useStore();
  const [filter, setFilter] = useState<OrderFilter>('active');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  };

  const filteredOrders = orders.filter(order => {
    switch (filter) {
      case 'active':
        return order.status === 'new';
      case 'in_progress':
        return order.status === 'in_progress';
      case 'completed':
        return order.status === 'completed';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <span className="material-icons animate-spin text-orange-500 text-4xl">
            refresh
          </span>
          <p className="text-secondary-light">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex w-full bg-white rounded-lg shadow-sm">
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-primary text-white rounded-lg'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            filter === 'in_progress'
              ? 'bg-primary text-white rounded-lg'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-primary text-white rounded-lg'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-secondary">
                      Order #{order.order_number}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      order.status === 'new'
                        ? 'bg-primary/10 text-primary'
                        : order.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'new' ? 'Active' : order.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-secondary-light mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                {order.payment_method && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-success-light text-success">
                    {order.payment_method === 'cash' ? 'Cash' : 'GPay'}
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-medium">
                        {item.quantity}x
                      </span>
                      <span className="text-secondary">{item.name}</span>
                    </div>
                    <span className="text-secondary">
                      ₹{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-secondary">
                  <span className="font-medium">Total:</span> ₹
                  {order.total_amount.toFixed(2)}
                </div>
                <OrderActions order={order} />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <span className="material-icons text-4xl text-secondary-light mb-3">
              receipt_long
            </span>
            <h3 className="text-lg font-medium text-secondary mb-1">
              No {filter} Orders
            </h3>
            <p className="text-secondary-light">
              {filter === 'active'
                ? 'No new orders at the moment'
                : filter === 'in_progress'
                ? 'No orders are being prepared'
                : 'No completed orders yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 