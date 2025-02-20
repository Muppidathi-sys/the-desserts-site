import { Order } from '../types';
import { formatPrice } from '../utils/format';

interface PaymentDialogProps {
  order: Order;
  onClose: () => void;
  onComplete: (paymentMethod: 'cash' | 'gpay') => void;
}

export function PaymentDialog({ order, onClose, onComplete }: PaymentDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Complete Order #{order.order_number}
        </h2>

        <div className="bg-primary/5 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-secondary-light">Total Amount</span>
            <span className="text-xl font-semibold text-primary">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onComplete('cash')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary">payments</span>
              <span className="text-secondary font-medium">Cash Payment</span>
            </div>
            <span className="material-icons text-secondary-light">chevron_right</span>
          </button>

          <button
            onClick={() => onComplete('gpay')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary">phone_android</span>
              <span className="text-secondary font-medium">Google Pay</span>
            </div>
            <span className="material-icons text-secondary-light">chevron_right</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 text-secondary-light hover:text-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 