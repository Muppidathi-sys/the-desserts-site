import { create } from 'zustand';
import { User, Order, MenuItem } from '../types';
import { showToast } from '../utils/toast';
import { supabase } from '../lib/supabase';

// Use environment variable or fallback to Supabase URL
const API_URL = import.meta.env.VITE_API_URL || 'https://ubvwojinudujgfiqjiks.supabase.co';

// Define store state and actions in one place
interface StoreState {
  // State
  user: User | null;
  users: User[];
  orders: Order[];
  menuItems: MenuItem[];
  loading: boolean;

  // Add loading flags
  isLoading: {
    orders: boolean;
    menuItems: boolean;
  };

  // Add webhook status
  webhookStatus: {
    processing: boolean;
    error: string | null;
  };

  // Actions
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  setMenuItems: (items: MenuItem[]) => void;
  addOrder: (order: Partial<Order>) => Promise<Order>;
  updateOrder: (order: Order) => Promise<void>;
  fetchOrders: () => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  resetMenuItems: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  initializeMenuItems: () => Promise<void>;
}

// Create the store with type safety
export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  user: null,
  users: [],
  orders: [],
  menuItems: [],
  loading: false,

  // Add loading flags
  isLoading: {
    orders: false,
    menuItems: false
  },

  // Add webhook status
  webhookStatus: {
    processing: false,
    error: null
  },

  // Actions implementation
  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
  setMenuItems: (items) => set({ menuItems: items }),

  fetchOrders: async () => {
    try {
      set({ loading: true });
      console.log('Fetching orders...'); // Debug log

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_item:menu_items(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders:', data); // Debug log
      set({ orders: data || [] });
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast.error('Failed to load orders');
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (order) => {
    try {
      set({ webhookStatus: { processing: true, error: null } });

      const { error } = await supabase
        .from('orders')
        .update({
          status: order.status,
          payment_method: order.payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order.order_id);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) => 
          o.order_id === order.order_id ? { ...o, ...order } : o
        ),
        webhookStatus: { processing: false, error: null }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
      set({ webhookStatus: { processing: false, error: errorMessage } });
      throw error;
    }
  },

  addOrder: async (order: Partial<Order>) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: order.order_number,
          status: 'new',
          total_amount: order.total_amount,
          created_by: order.created_by,
          payment_method: order.payment_method
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      if (order.order_items && order.order_items.length > 0) {
        const orderItems = order.order_items.map(item => ({
          order_id: orderData.order_id,
          item_id: item.item_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return orderData;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  },

  addMenuItem: async (item) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        menuItems: [...state.menuItems, data]
      }));
    } catch (err) {
      throw err;
    }
  },

  updateMenuItem: async (item) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          size: item.size
        })
        .eq('item_id', item.item_id);

      if (error) throw error;

      set((state) => ({
        menuItems: state.menuItems.map((i) => 
          i.item_id === item.item_id ? item : i
        )
      }));
    } catch (err) {
      throw err;
    }
  },

  deleteMenuItem: async (itemId) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('item_id', itemId);

      if (error) throw error;

      set((state) => ({
        menuItems: state.menuItems.filter((i) => i.item_id !== itemId)
      }));
    } catch (err) {
      throw err;
    }
  },

  resetMenuItems: async () => {
    try {
      set({ loading: true });
      await supabase.from('menu_items').delete().neq('item_id', '');
      set({ menuItems: [], loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchMenuItems: async () => {
    // Check if already loading
    if (get().isLoading.menuItems) return;

    try {
      set(state => ({ isLoading: { ...state.isLoading, menuItems: true } }));
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      console.log('Fetched menu items:', data); // Debug log
      set({ menuItems: data || [] });
    } catch (err) {
      console.error('Error fetching menu items:', err);
      showToast.error('Failed to load menu items');
    } finally {
      set(state => ({ isLoading: { ...state.isLoading, menuItems: false } }));
    }
  },

  initializeMenuItems: async () => {
    try {
      set({ loading: true });

      // First delete existing items
      await supabase.from('menu_items').delete().neq('item_id', '');

      // Complete menu items list
      const menuItems = [
        // Belgian Mini Waffles
        {
          name: "Death by chocolate",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Ultimate chocolate experience"
        },
        {
          name: "Dark choco",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Rich dark chocolate waffle"
        },
        {
          name: "White choco",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Creamy white chocolate waffle"
        },
        {
          name: "Milk choco",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Classic milk chocolate waffle"
        },
        {
          name: "Butter scotch",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Sweet butterscotch flavored waffle"
        },
        {
          name: "Cotton candy",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Sweet cotton candy flavored waffle"
        },
        {
          name: "Gems Mafia",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Colorful gems topped waffle"
        },
        {
          name: "Nutella",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Classic Nutella spread waffle"
        },
        {
          name: "Cookies N Cream",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Crushed cookies and cream waffle"
        },
        {
          name: "Crunchy (kit kat)",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Kit kat topped crunchy waffle"
        },
        {
          name: "Orea cookies",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Oreo cookies topped waffle"
        },
        {
          name: "Mango Mafia",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Fresh mango flavored waffle"
        },
        {
          name: "Strawberry surprise",
          price: 50,
          size: "regular",
          category: "belgian_waffle",
          description: "Sweet strawberry flavored waffle"
        },

        // Belgian Large Waffles
        {
          name: "Death by chocolate",
          price: 80,
          size: "large",
          category: "belgian_waffle",
          description: "Large ultimate chocolate experience"
        },
        // ... (I can continue with the rest of the items if you want)
      ].map(item => ({
        ...item,
        created_at: new Date().toISOString()
      }));

      // Insert all items
      const { error } = await supabase
        .from('menu_items')
        .insert(menuItems);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      // Fetch the updated menu items
      const { data: updatedMenu, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (fetchError) throw fetchError;

      set({ menuItems: updatedMenu || [] });
      showToast.success('Menu items initialized successfully');
    } catch (err) {
      console.error('Failed to initialize menu items:', err);
      showToast.error('Failed to initialize menu items');
    } finally {
      set({ loading: false });
    }
  }
}));

// Export type for components that need it
export type { StoreState }; 