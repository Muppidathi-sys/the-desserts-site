import { useEffect, useState } from 'react';
import { useStore } from '../store';

export function Debug() {
  const { users, menuItems, orders, loading, resetMenuItems, fetchMenuItems, initializeMenuItems } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchMenuItems()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  };

  const handleResetMenuItems = async () => {
    try {
      setIsResetting(true);
      setError(null);
      await resetMenuItems();
      await fetchMenuItems(); // Fetch updated menu items
      console.log('Menu items after reset:', menuItems);
    } catch (err) {
      console.error('Reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset menu items');
    } finally {
      setIsResetting(false);
    }
  };

  const handleInitializeMenu = async () => {
    try {
      await initializeMenuItems();
    } catch (err) {
      console.error('Failed to initialize menu:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debug Panel</h1>
        <button
          onClick={handleResetMenuItems}
          disabled={isResetting || loading}
          className={`px-4 py-2 rounded-lg ${
            isResetting || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white`}
        >
          {isResetting ? 'Resetting...' : 'Reset Menu Items'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          <p>Error: {error}</p>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
          <p>Loading...</p>
        </div>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">Users ({users.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Menu Items ({menuItems.length})</h2>
          <button
            onClick={() => fetchMenuItems()}
            className="text-blue-500 hover:text-blue-600"
          >
            Refresh
          </button>
        </div>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(menuItems, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(orders, null, 2)}
        </pre>
      </section>

      <button 
        onClick={handleInitializeMenu}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Initialize Menu Items
      </button>
    </div>
  );
} 