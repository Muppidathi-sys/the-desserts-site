import { useState } from 'react';
import { useStore } from '../store';
import { MenuItem } from '../types';
import { showToast } from '../utils/toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function MenuManager() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as MenuItem['category'],
      size: formData.get('size') as MenuItem['size']
    };

    try {
      if (editingItem) {
        await updateMenuItem({ ...editingItem, ...itemData });
        showToast.success('Menu item updated successfully');
      } else {
        await addMenuItem(itemData);
        showToast.success('Menu item added successfully');
      }
      form.reset();
      setShowAddForm(false);
      setEditingItem(null);
    } catch (err) {
      showToast.error('Failed to save menu item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[16px] font-medium text-secondary">Menu Items</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-[14px]"
        >
          Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-[16px] font-medium text-secondary mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[14px] text-secondary-light">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-[14px]"
                />
              </div>
              <div>
                <label className="text-[14px] text-secondary-light">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-[14px]"
                />
              </div>
              <div>
                <label className="text-[14px] text-secondary-light">Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingItem?.price}
                  required
                  min="0"
                  step="0.01"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-[14px]"
                />
              </div>
              <div>
                <label className="text-[14px] text-secondary-light">Category</label>
                <select
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-[14px]"
                >
                  <option value="mini_waffle">Mini Waffle</option>
                  <option value="belgian_waffle">Belgian Waffle</option>
                  <option value="bubble_waffle">Bubble Waffle</option>
                </select>
              </div>
              <div>
                <label className="text-[14px] text-secondary-light">Size</label>
                <select
                  name="size"
                  defaultValue={editingItem?.size}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-[14px]"
                >
                  <option value="regular">Regular</option>
                  <option value="semi">Semi</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 text-[14px] text-secondary-light hover:text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white text-[14px] rounded-lg"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white rounded-xl">
        <div className="grid gap-2 p-4">
          {menuItems.map(item => (
            <div
              key={item.item_id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="text-[14px] font-medium text-secondary">{item.name}</h3>
                <p className="text-[12px] text-secondary-light">₹{item.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this item?')) {
                      try {
                        await deleteMenuItem(item.item_id);
                        showToast.success('Menu item deleted successfully');
                      } catch (err) {
                        showToast.error('Failed to delete menu item');
                      }
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 