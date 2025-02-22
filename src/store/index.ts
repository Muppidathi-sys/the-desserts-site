import { create } from 'zustand';
import { User, Order, MenuItem } from '../types';
import { supabase } from '../lib/supabase';

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
    // Check if already loading
    if (get().isLoading.orders) return;
    
    try {
      set(state => ({ isLoading: { ...state.isLoading, orders: true } }));
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: orders || [] });
    } catch (err) {
      throw err;
    } finally {
      set(state => ({ isLoading: { ...state.isLoading, orders: false } }));
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

  addOrder: async (order) => {
    try {
      set({ webhookStatus: { processing: true, error: null } });

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: order.order_number,
          status: 'new',
          total_amount: order.total_amount,
          notes: order.notes || '',
          created_by: order.created_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      if (order.items && order.items.length > 0) {
        const orderItems = order.items.map(item => ({
          order_id: orderData.order_id,
          item_id: item.item_id,
          name: item.name,
          quantity: item.quantity,
          item_price: item.item_price || item.price,
          subtotal: item.subtotal,
          special_instructions: item.special_instructions || ''
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      const { data: completeOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('order_id', orderData.order_id)
        .single();

      if (fetchError) throw fetchError;

      set((state) => ({
        orders: [completeOrder, ...state.orders],
        webhookStatus: { processing: false, error: null }
      }));

      return completeOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add order';
      set({ webhookStatus: { processing: false, error: errorMessage } });
      throw error;
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
      set({ menuItems: data || [] });
    } catch (err) {
      throw err;
    } finally {
      set(state => ({ isLoading: { ...state.isLoading, menuItems: false } }));
    }
  }
}));

// Export type for components that need it
export type { StoreState }; 