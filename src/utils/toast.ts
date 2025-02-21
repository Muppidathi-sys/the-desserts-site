import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#333',
        color: '#fff',
        padding: '12px 16px',
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#333',
        color: '#fff',
        padding: '12px 16px',
      },
    });
  },

  // Standard messages
  orderSuccess: () => showToast.success('Order placed successfully'),
  orderStarted: () => showToast.success('Order started processing'),
  orderCompleted: () => showToast.success('Order completed'),
  loginRequired: () => showToast.error('Please login first'),
  updateError: () => showToast.error('Failed to update order'),
  orderError: () => showToast.error('Failed to place order'),
  orderCancelled: () => showToast.success('Order cancelled'),
}; 