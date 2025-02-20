import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { User } from '../types';

export function Users() {
  const { user: currentUser, users, addUser } = useStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-icons animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    );
  }

  console.log('Current User:', currentUser);
  console.log('Users List:', users);

  // Only show if current user is a manager
  if (currentUser?.role !== 'manager') {
    console.log('Access denied: Not a manager');
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <span className="material-icons text-4xl text-secondary-light mb-3">
          lock
        </span>
        <h3 className="text-lg font-medium text-secondary mb-1">
          Access Restricted
        </h3>
        <p className="text-secondary-light">
          Only managers can access user management
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium text-secondary">Employee Management</h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <span className="material-icons text-sm">add</span>
          Add Employee
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-secondary font-medium">Employee List</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {users.map(user => (
            <div key={user.user_id} className="px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-secondary font-medium">{user.username}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-secondary-light capitalize">{user.role}</p>
                  <span className="text-sm text-secondary-light">•</span>
                  <p className="text-sm text-secondary-light">{user.phone || 'No phone'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Dialog */}
      {showAddDialog && (
        <AddUserDialog onClose={() => setShowAddDialog(false)} onAdd={addUser} />
      )}
    </div>
  );
}

interface AddUserDialogProps {
  onClose: () => void;
  onAdd: (user: User) => void;
}

function AddUserDialog({ onClose, onAdd }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    role: 'operator' as 'operator' | 'kitchen'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      user_id: `user-${Date.now()}`,
      username: formData.username,
      phone: formData.phone,
      role: formData.role,
      created_at: new Date().toISOString()
    };
    onAdd(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-medium text-secondary mb-4">
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary-light text-sm mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter employee name"
              required
            />
          </div>

          <div>
            <label className="block text-secondary-light text-sm mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-secondary-light text-sm mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'operator' | 'kitchen' })}
              className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="operator">Operator</option>
              <option value="kitchen">Kitchen Staff</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-secondary-light hover:text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded-lg font-medium"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 