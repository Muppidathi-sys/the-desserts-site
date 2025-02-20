import { useNavigate } from 'react-router-dom';
import { CreateOrder } from '../components/CreateOrder';

export function CreateOrderPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
        <button
          onClick={() => navigate('/')}
          className="text-secondary-light"
        >
          Cancel
        </button>
        <h1 className="text-lg font-medium text-secondary">
          New Order
        </h1>
        <button
          type="submit"
          form="create-order-form"
          className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium"
        >
          Save Order
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <CreateOrder />
      </div>
    </div>
  );
} 