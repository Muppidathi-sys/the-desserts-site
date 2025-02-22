import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { OrderActions } from '../components/OrderActions';
// import { formatPrice } from '../utils/format';
import { Order } from '../types';
import { supabase } from '../lib/supabase';
// import { RealtimeChannel } from '@supabase/supabase-js';
import type { OrderStatus } from '../types';
import { EmptyState } from '../components/EmptyState';
import { BsInboxFill, BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';

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

// Helper function to format status
const formatStatus = (status: OrderStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Separate OrderCard component
function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Order Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">#{order.order_number}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {formatStatus(order.status)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(order.created_at).toLocaleString()}
        </p>
        {order.payment_method && (
          <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {order.payment_method === 'cash' ? 'Cash' : 'GPay'}
          </span>
        )}
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-2">
        {order.order_items?.map(item => (
          <div key={item.order_item_id} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium">{item.quantity}x</span>
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="text-gray-900">₹{item.subtotal}</span>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">
            Total: ₹{order.total_amount}
          </p>
          <OrderActions order={order} />
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const { orders, loading, fetchOrders } = useStore();
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
          return ['completed', 'cancelled'].includes(order.status);
        default:
          return false;
      }
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-icons animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-1 rounded-lg">
        {['new', 'processing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status as OrderStatus)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === status
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {status === 'new' ? 'Active' : 
             status === 'processing' ? 'In Progress' : 
             'Completed'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <EmptyState
              title={`No ${activeTab} orders`}
              message={
                activeTab === 'new' 
                  ? "No active orders at the moment. Create a new order to get started!"
                  : activeTab === 'processing'
                  ? "No orders are being processed right now."
                  : "No completed orders to show."
              }
              icon={<BsInboxFill className="text-4xl text-primary/60" />}
              action={
                activeTab === 'new' && (
                  <Link
                    to="/new-order"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <BsPlus className="text-xl mr-1" />
                    Create Order
                  </Link>
                )
              }
            />
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.order_id} className="bg-white rounded-lg shadow-sm p-3">
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

              <div className="space-y-2 mb-3">
                {order.order_items.map((item) => (
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
          ))
        )}
      </div>
    </div>
  );
} 