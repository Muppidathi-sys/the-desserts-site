import { useEffect } from 'react';
import { useStore } from '../store';

export function Orders() {
  const { orders, loading, fetchOrders } = useStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {orders.map(order => (
        <div key={order.order_id}>
          <h3>{order.order_number}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total_amount}</p>
        </div>
      ))}
    </div>
  );
} 