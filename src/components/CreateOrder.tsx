import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { MenuItem, OrderItem } from '../types';
import { formatPrice } from '../utils/format';
import { BsSearch, BsPlus } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { IoRemove } from 'react-icons/io5';

interface OrderItemInput extends OrderItem {
  name: string;
}

export function CreateOrder() {
  const navigate = useNavigate();
  const { menuItems, loading, fetchMenuItems, addOrder } = useStore();
  const [selectedItems, setSelectedItems] = useState<{id: string, quantity: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if menuItems is empty
    if (menuItems.length === 0) {
      fetchMenuItems();
    }
  }, []); // Empty dependency array means this runs once on mount

  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.item_id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.id === menuItem.item_id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      ));
    } else {
      const newItem: {id: string, quantity: number} = {
        id: menuItem.item_id,
        quantity: 1
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId
        ? {
            ...item,
            quantity
          }
        : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { user } = useStore.getState();
    
    if (!user) {
      console.error('No user found');
      return;
    }

    const totalAmount = selectedItems.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.item_id === item.id);
      return sum + (item.quantity * (menuItem?.price || 0));
    }, 0);

    const newOrder = {
      order_number: `${Date.now().toString().slice(-4)}`,
      status: 'new',
      total_amount: totalAmount,
      notes: '',
      created_by: user.user_id, // Use the actual user UUID
      items: selectedItems.map(item => {
        const menuItem = menuItems.find(m => m.item_id === item.id);
        return {
          item_id: item.id,
          name: menuItem?.name || '',
          quantity: item.quantity,
          item_price: menuItem?.price || 0,
          subtotal: item.quantity * (menuItem?.price || 0),
          special_instructions: ''
        };
      })
    };

    addOrder(newOrder);
    setSelectedItems([]);
    setSearchQuery('');
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const items = Object.entries(groupedItems).map(([category, items]) => ({
    category,
    items: items as MenuItem[]
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={fetchMenuItems}
          className="mt-2 text-primary hover:text-primary-dark"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form id="create-order-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg">
        <div className="px-4 py-3">
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waffles..."
              className="w-full bg-gray-50 rounded-lg pl-10 pr-4 py-2 text-secondary placeholder:text-secondary-light focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8 pb-48">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-medium text-secondary mb-4 capitalize">
              {category.replace('_', ' ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.item_id}
                  className="bg-white rounded-xl shadow-card p-4"
                >
                  <h3 className="text-secondary font-medium">{item.name}</h3>
                  <p className="text-secondary-light text-sm mt-1">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-medium">
                      ₹{item.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => addItemToOrder(item)}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center"
                    >
                      <BsPlus className="text-2xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        {/* Selected Items Section */}
        {selectedItems.length > 0 && (
          <div className="max-h-48 overflow-y-auto px-4 py-3 border-b border-gray-100">
            <div className="space-y-3">
              {selectedItems.map(selectedItem => {
                const item = menuItems.find(m => m.item_id === selectedItem.id);
                if (!item) return null;
                return (
                  <div key={item.item_id} className="flex justify-between items-center">
                    <div>
                      <h3 className="text-secondary font-medium">{item.name}</h3>
                      <p className="text-primary text-sm font-medium">
                        {formatPrice(item.price)} × {selectedItem.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-secondary-light hover:bg-gray-100"
                        onClick={() => removeItemFromOrder(item.item_id)}
                      >
                        <IoRemove className="text-sm" />
                      </button>
                      <span className="w-8 text-center text-secondary font-medium">
                        {selectedItem.quantity}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-secondary-light hover:bg-gray-100"
                        onClick={() => addItemToOrder(item)}
                      >
                        <BsPlus className="text-2xl" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Total and Place Order */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-secondary-light">Total Items</span>
              <span className="text-secondary ml-2">
                {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <span className="text-xl font-semibold text-primary">
              {formatPrice(selectedItems.reduce((total, item) => {
                const menuItem = menuItems.find(m => m.item_id === item.id);
                return total + (menuItem?.price || 0) * item.quantity;
              }, 0))}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
} 