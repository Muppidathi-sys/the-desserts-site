import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store';
import { OrderActions } from '../components/OrderActions';
import { formatPrice } from '../utils/format';
import { Order } from '../types';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

// Move getStatusColor outside components
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    case 'processing':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-primary bg-primary/10';
  }
};

// Separate OrderCard component
function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-medium text-secondary">
              Order #{order.order_number}
            </h3>
            <span className={`px-2 py-0.5 text-[12px] font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-[12px] text-secondary-light mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        {order.payment_method && (
          <span className="px-2 py-0.5 rounded-full text-[12px] font-medium bg-success-light text-success">
            {order.payment_method === 'cash' ? 'Cash' : 'GPay'}
          </span>
        )}
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-3">
        {order.items.map((item) => (
          <div key={item.order_item_id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-primary font-medium">
                {item.quantity}x
              </span>
              <span className="text-[14px] text-secondary truncate">
                {item.name}
              </span>
            </div>
            <span className="text-[14px] text-secondary whitespace-nowrap">
              ₹{item.subtotal.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-secondary">
          <span className="text-[14px] font-medium">Total:</span>{' '}
          <span className="text-[14px]">₹{order.total_amount.toFixed(2)}</span>
        </div>
        <OrderActions order={order} />
      </div>
    </div>
  );
}

export function Orders() {
  const { orders, loading, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            fetchOrders(); // Refresh orders on any change
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'order_items'
          },
          () => {
            fetchOrders(); // Refresh orders when items change
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    // Cleanup subscription
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      switch (activeTab) {
        case 'new':
          return order.status === 'new';
        case 'processing':
          return order.status === 'processing';
        case 'completed':
          // Show both completed and cancelled orders in completed tab
          return ['completed', 'cancelled'].includes(order.status);
        default:
          return false;
      }
    }).sort((a, b) => {
      // Sort cancelled orders after completed ones
      if (activeTab === 'completed') {
        if (a.status === 'cancelled' && b.status === 'completed') return 1;
        if (a.status === 'completed' && b.status === 'cancelled') return -1;
      }
      // Otherwise sort by creation date, newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [orders, activeTab]);

  const tabs: { status: OrderStatus; label: string }[] = [
    { status: 'new', label: 'Active' },
    { status: 'processing', label: 'In Progress' },
    { status: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
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
    <div>
      {/* Status Tabs */}
      <div className="bg-white rounded-xl p-2">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map(({ status, label }) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`py-2 px-3 rounded-lg font-medium text-[14px] whitespace-nowrap text-center transition-all ${
                activeTab === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary-light hover:text-secondary hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-3 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <span className="material-icons text-2xl text-secondary-light mb-2">
              receipt_long
            </span>
            <p className="text-[14px] text-secondary-light">
              No {activeTab.toLowerCase()} orders
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard key={order.order_id} order={order} />
          ))
        )}
      </div>
    </div>
  );
} 