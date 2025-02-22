import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import type { MenuItem, Order } from '../types';
import { BsSearch, BsPlus } from 'react-icons/bs';
import { showToast } from '../utils/toast';

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function CreateOrder() {
  const navigate = useNavigate();
  const { menuItems, loading, fetchMenuItems, addOrder } = useStore();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addItemToOrder = (menuItem: MenuItem) => {
    console.log('Adding item:', menuItem); // Debug log

    setSelectedItems(prev => {
      const existingItem = prev.find(item => item.id === menuItem.item_id);
      
      if (existingItem) {
        return prev.map(item => 
          item.id === menuItem.item_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, {
        id: menuItem.item_id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setSelectedItems(prev => prev.filter(item => item.id !== itemId));
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const { user } = useStore.getState();
      
      if (!user) {
        showToast.loginRequired();
        return;
      }

      const newOrder: Partial<Order> = {
        order_number: `${Date.now().toString().slice(-4)}`,
        status: 'new',
        total_amount: selectedItems.reduce((sum, item) => 
          sum + (item.quantity * item.price), 0
        ),
        created_by: user.user_id,
        items: selectedItems.map(item => ({
          item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          item_price: item.price,
          price: item.price,
          subtotal: item.quantity * item.price
        }))
      };

      await addOrder(newOrder);
      showToast.orderSuccess();
      navigate('/');
    } catch (error) {
      console.error('Failed to place order:', error);
      showToast.orderError();
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => 
      total + (item.quantity * item.price), 0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-icons animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menu Section */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full px-4 py-2 pl-10 bg-white rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light" />
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            {filteredItems.map(item => (
              <div 
                key={item.item_id}
                className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <h3 className="text-[14px] font-medium text-secondary">
                    {item.name}
                  </h3>
                  <p className="text-[12px] text-secondary-light">
                    ₹{item.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addItemToOrder(item)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                >
                  <BsPlus className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary - Fixed for both desktop and mobile */}
        <div className="fixed bottom-16 inset-x-0 bg-white border-t border-gray-100 lg:relative lg:bottom-0 lg:border-0">
          <div className="p-4 lg:bg-white lg:rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[16px] font-medium text-secondary">Selected Items</h2>
              <span className="text-[14px] text-secondary-light">{selectedItems.length} items</span>
            </div>

            {/* Selected Items */}
            <div className="max-h-48 overflow-y-auto mb-4">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-[14px] text-secondary">{item.name}</p>
                    <p className="text-[12px] text-secondary-light">₹{item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-primary text-xl"
                    >
                      -
                    </button>
                    <span className="text-[14px] font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-primary text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="space-y-3 border-t pt-3">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-secondary-light">Subtotal ({selectedItems.length} items)</span>
                <span className="text-secondary">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-medium text-secondary">Total Amount</span>
                <span className="text-[16px] font-semibold text-primary">₹{calculateTotal()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedItems.length === 0}
              className="w-full bg-primary text-white py-3 rounded-lg text-[14px] font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 