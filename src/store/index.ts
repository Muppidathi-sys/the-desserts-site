import { create } from 'zustand';
import { User, Order, MenuItem } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  user: User | null;
  orders: Order[];
  menuItems: MenuItem[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  setMenuItems: (items: MenuItem[]) => void;
  addOrder: (order: Partial<Order>) => Promise<Order>;
  updateOrder: (order: Order) => Promise<void>;
  fetchOrders: () => Promise<void>;
  addMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  orders: [],
  menuItems: [],
  loading: false,

  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
  setMenuItems: (items) => set({ menuItems: items }),

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: orders || [], loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateOrder: async (order) => {
    try {
      // First update in database
      const { error } = await supabase
        .from('orders')
        .update({
          status: order.status,
          payment_method: order.payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order.order_id);

      if (error) throw error;

      // Then update local state
      set((state) => ({
        orders: state.orders.map((o) => 
          o.order_id === order.order_id ? { ...o, ...order } : o
        )
      }));

      // Finally fetch fresh data
      const { data: orders, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      set({ orders: orders || [] });

    } catch (err) {
      throw err;
    }
  },

  addOrder: async (order) => {
    try {
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

      const orderItems = order.items?.map(item => ({
        order_id: orderData.order_id,
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity,
        item_price: item.price,
        subtotal: item.subtotal,
        special_instructions: item.special_instructions || ''
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

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
        orders: [completeOrder, ...state.orders]
      }));

      return completeOrder;
    } catch (err) {
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
  }
})); 