import { useState } from 'react';
import { useStore } from '../store';
import { Order } from '../types';
import { PaymentDialog } from './PaymentDialog';

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const { updateOrder } = useStore();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleStartOrder = () => {
    updateOrder({
      ...order,
      status: 'in_progress',
      updated_at: new Date().toISOString()
    });
  };

  const handleCompleteOrder = (paymentMethod: 'cash' | 'gpay') => {
    updateOrder({
      ...order,
      status: 'completed',
      updated_at: new Date().toISOString(),
      payment_method: paymentMethod
    });
    setShowPaymentDialog(false);
  };

  return (
    <>
      <div className="flex gap-3">
        {order.status === 'new' && (
          <button
            onClick={() => updateOrder({ ...order, status: 'in_progress' })}
            className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Start Order
          </button>
        )}
        
        {order.status === 'in_progress' && (
          <button
            onClick={() => setShowPaymentDialog(true)}
            className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Mark as Done
          </button>
        )}
      </div>

      {showPaymentDialog && (
        <PaymentDialog
          order={order}
          onClose={() => setShowPaymentDialog(false)}
          onComplete={(paymentMethod) => {
            updateOrder({
              ...order,
              status: 'completed',
              payment_method: paymentMethod
            });
            setShowPaymentDialog(false);
          }}
        />
      )}
    </>
  );
} 