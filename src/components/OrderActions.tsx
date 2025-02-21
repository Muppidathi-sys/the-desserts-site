import { useState } from 'react';
import { useStore } from '../store';
import { Order } from '../types';
import { PaymentDialog } from './PaymentDialog';
import { showToast } from '../utils/toast';
import { FaTrash } from 'react-icons/fa';

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const updateOrder = useStore(state => state.updateOrder);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      await updateOrder({
        ...order,
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
      showToast.orderCancelled();
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      showToast.updateError();
    } finally {
      setLoading(false);
    }
  };

  const handleStartOrder = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await updateOrder({
        ...order,
        status: 'processing'
      });
      showToast.orderStarted();
    } catch (err) {
      console.error('Failed to start order:', err);
      showToast.updateError();
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (paymentMethod: 'cash' | 'gpay') => {
    if (loading) return;

    try {
      setLoading(true);
      await updateOrder({
        ...order,
        status: 'completed',
        payment_method: paymentMethod,
        updated_at: new Date().toISOString()
      });
      showToast.orderCompleted();
      setShowPaymentDialog(false);
    } catch (err) {
      console.error('Failed to complete order:', err);
      showToast.updateError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {order.status === 'new' && (
          <>
            <button
              onClick={handleStartOrder}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              Start Order
            </button>
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={loading}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
              title="Cancel Order"
            >
              <FaTrash className="text-[14px]" />
            </button>
          </>
        )}
        
        {order.status === 'processing' && (
          <>
            <button
              onClick={() => setShowPaymentDialog(true)}
              className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors"
            >
              Mark as Done
            </button>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Cancel Order"
            >
              <FaTrash className="text-[14px]" />
            </button>
          </>
        )}
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <PaymentDialog
          order={order}
          onClose={() => setShowPaymentDialog(false)}
          onComplete={handleCompleteOrder}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <h3 className="text-[16px] font-medium text-secondary mb-2">
              Cancel Order
            </h3>
            <p className="text-[14px] text-secondary-light mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 text-[14px] text-secondary-light hover:text-secondary"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 text-[14px] font-medium rounded-lg hover:bg-red-100"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 