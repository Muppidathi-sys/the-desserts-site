import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { MenuItem } from '../types';
import { BsSearch, BsArrowLeft } from 'react-icons/bs';

export function CreateOrderPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  // ... other state and logic

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <BsArrowLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-secondary">New Order</h1>
        </div>
        <button
          onClick={handleSaveOrder}
          disabled={selectedItems.length === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedItems.length === 0
              ? 'bg-gray-100 text-gray-400'
              : 'bg-primary text-white'
          }`}
        >
          Save Order
        </button>
      </header>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-auto">
        {/* ... rest of your menu items code */}
      </div>

      {/* Selected Items */}
      <div className="border-t">
        <div className="p-4">
          <h2 className="text-lg font-medium text-secondary mb-2">
            Selected Items
            <span className="text-sm text-gray-500 ml-2">
              ({selectedItems.length} items)
            </span>
          </h2>
          {/* ... selected items list */}
        </div>

        {/* Total and Place Order */}
        <div className="border-t p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-secondary">Total Amount</span>
            <span className="text-xl font-medium text-primary">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={selectedItems.length === 0}
            className={`w-full py-3 rounded-lg text-sm font-medium ${
              selectedItems.length === 0
                ? 'bg-gray-100 text-gray-400'
                : 'bg-primary text-white'
            }`}
          >
            Place Order ({selectedItems.length})
          </button>
        </div>
      </div>
    </div>
  );
} 