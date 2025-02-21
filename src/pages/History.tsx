import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { formatPrice } from '../utils/format';
import { Order } from '../types';
import { BsSearch } from 'react-icons/bs';

type FilterStatus = 'all' | 'completed' | 'cancelled';
type FilterPayment = 'all' | 'cash' | 'gpay';

export function History() {
  const { orders, loading, fetchOrders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<FilterPayment>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and search orders - only completed and cancelled orders
  const filteredOrders = orders
    .filter(order => {
      // Only show completed and cancelled orders
      if (!['completed', 'cancelled'].includes(order.status)) return false;

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      
      // Payment method filter (only for completed orders)
      if (paymentFilter !== 'all' && order.status === 'completed' && order.payment_method !== paymentFilter) return false;
      
      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          order.order_number.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-3 space-y-2">
        {/* Search */}
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light text-[14px]" />
          <input
            type="text"
            placeholder="Search order number or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[14px] rounded-lg bg-gray-50 text-secondary placeholder:text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-[12px] text-secondary-light mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="w-full px-2 py-1.5 text-[14px] rounded-lg bg-gray-50 text-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Orders</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          {(statusFilter === 'all' || statusFilter === 'completed') && (
            <div className="flex-1">
              <label className="block text-[12px] text-secondary-light mb-1">
                Payment Method
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as FilterPayment)}
                className="w-full px-2 py-1.5 text-[14px] rounded-lg bg-gray-50 text-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Payments</option>
                <option value="cash">Cash</option>
                <option value="gpay">GPay</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-icons animate-spin text-primary text-2xl">
            refresh
          </span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center">
          <span className="material-icons text-2xl text-secondary-light mb-2">
            receipt_long
          </span>
          <p className="text-sm text-secondary-light">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map(order => (
            <div key={order.order_id} className="bg-white rounded-lg shadow-sm">
              {/* Order Header */}
              <div className="p-3 border-b border-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-[14px] font-medium text-secondary">
                      #{order.order_number}
                    </span>
                    <div className="text-[12px] text-secondary-light mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[12px] rounded-full ${
                    order.status === 'completed' 
                      ? 'bg-success/10 text-success'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-3 space-y-1.5">
                {order.items?.map(item => (
                  <div key={item.item_id} className="flex justify-between text-[14px]">
                    <div className="text-secondary truncate pr-2">
                      {item.name} <span className="text-secondary-light">×{item.quantity}</span>
                    </div>
                    <span className="text-secondary whitespace-nowrap">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-3 py-2 bg-gray-50 rounded-b-lg flex justify-between items-center">
                <span className="text-[12px] font-medium text-secondary-light">
                  {order.payment_method?.toUpperCase() || 'Not Paid'}
                </span>
                <span className="text-[14px] font-medium text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 