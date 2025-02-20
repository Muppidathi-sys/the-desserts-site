import { useStore } from '../store';
import { formatPrice } from '../utils/format';
import { Order } from '../types';

export function History() {
  const { orders } = useStore();
  const completedOrders = orders.filter(order => order.status === 'completed');

  // Group orders by date
  const groupedOrders = completedOrders.reduce((groups: Record<string, Order[]>, order) => {
    const date = new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (sortedDates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <span className="material-icons text-4xl text-secondary-light mb-3">
          history
        </span>
        <h3 className="text-lg font-medium text-secondary mb-1">
          No Order History
        </h3>
        <p className="text-secondary-light">
          Your completed orders will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date}>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-medium text-secondary">{date}</h2>
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-secondary-light text-sm">
              {groupedOrders[date].length} orders
            </span>
          </div>

          <div className="grid gap-4">
            {groupedOrders[date].map(order => (
              <div 
                key={order.order_id}
                className="bg-white rounded-xl shadow-card p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-secondary">
                      Order #{order.order_number}
                    </h3>
                    <span className="text-sm text-secondary-light">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-secondary-light">
                    Completed
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.order_item_id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-medium">{item.quantity}×</span>
                        <span className="text-secondary">{item.name}</span>
                      </div>
                      <span className="text-secondary-light">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-secondary-light">Total Amount</span>
                  <span className="text-lg font-semibold text-secondary">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 