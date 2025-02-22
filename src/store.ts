import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from './lib/supabase';
import { User, Order, MenuItem } from './types';
import toast from 'react-hot-toast';

// Create store without importing itself
const createStore = () => {
  type Store = {
    // State
    users: User[];
    user: User | null;
    orders: Order[];
    menuItems: MenuItem[];
    loading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setOrders: (orders: Order[]) => void;
    setMenuItems: (items: MenuItem[]) => void;
    addOrder: (order: Partial<Order>) => Promise<void>;
    updateOrder: (order: Order) => Promise<void>;
    fetchOrders: () => Promise<void>;
    fetchMenuItems: () => Promise<void>;
    resetOrders: () => Promise<void>;
    resetMenuItems: () => Promise<void>;
    addUser: (user: User) => Promise<void>;
    checkMenuItems: () => Promise<MenuItem[] | undefined>;
  };

  return create<Store>()(
    devtools(
      persist(
        (set, get) => ({
          // Initial state
          users: [],
          user: null,
          orders: [],
          menuItems: [],
          loading: false,

          // Actions
          setUser: (user) => set({ user }),
          setOrders: (orders) => set({ orders }),
          setMenuItems: (menuItems) => set({ menuItems }),
          addUser: async (user) => {
            set((state) => ({ users: [...state.users, user] }));
          },

          checkMenuItems: async () => {
            const { data, error } = await supabase
              .from('menu_items')
              .select('*')
              .order('category', { ascending: true });

            if (error) {
              console.error('Error fetching menu items:', error);
              return undefined;
            }

            return data;
          },

          addOrder: async (order) => {
            try {
              // First insert the order
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

              // Then insert order items without menu_item_id
              const orderItems = (order.items || []).map(item => ({
                order_id: orderData.order_id,
                name: item.name,
                quantity: item.quantity,
                item_price: item.item_price,
                subtotal: item.subtotal,
                special_instructions: item.special_instructions || ''
              }));

              const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)
                .select();

              if (itemsError) throw itemsError;

              // Combine order with its items
              const orderWithItems = {
                ...orderData,
                items: itemsData
              };

              set((state) => ({
                orders: [orderWithItems, ...state.orders]
              }));

              toast.success('Order placed successfully!');
              return orderWithItems;
            } catch (err) {
              toast.error('Failed to add order');
              console.error('Error adding order:', err);
              throw err;
            }
          },

          updateOrder: async (order) => {
            try {
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
                )
              }));

            } catch (err) {
              // Use get() to access fetchOrders
              await get().fetchOrders();
              throw err;
            }
          },

          fetchOrders: async () => {
            set({ loading: true });
            try {
              const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select(`
                  *,
                  order_items (
                    order_item_id,
                    name,
                    quantity,
                    item_price,
                    subtotal,
                    special_instructions
                  )
                `)
                .order('created_at', { ascending: false });

              if (ordersError) throw ordersError;

              // Transform the response to match our Order type
              const transformedOrders = orders.map(order => ({
                ...order,
                items: order.order_items || []
              }));

              set({ orders: transformedOrders });
            } catch (err) {
              console.error('Error fetching orders:', err);
              toast.error('Failed to fetch orders');
            } finally {
              set({ loading: false });
            }
          },

          fetchMenuItems: async () => {
            set({ loading: true });
            try {
              const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('name');

              if (error) throw error;

              set({ menuItems: data || [] });
            } catch (err) {
              console.error('Error fetching menu items:', err);
              throw err;
            } finally {
              set({ loading: false });
            }
          },

          resetOrders: async () => {
            try {
              set({ loading: true });
              
              await supabase.from('order_items').delete().neq('order_item_id', '');
              await supabase.from('orders').delete().neq('order_id', '');
              
              set({ orders: [], loading: false });
            } catch (err) {
              console.error('Error resetting orders:', err);
              set({ loading: false });
              throw err;
            }
          },

          resetMenuItems: async () => {
            try {
              set({ loading: true });

              // First delete all existing menu items
              const { error: deleteError } = await supabase
                .from('menu_items')
                .delete()
                .not('item_id', 'is', null);

              if (deleteError) {
                console.error('Delete error:', deleteError);
                throw deleteError;
              }

              // Then insert all menu items
              const menuItems = [
                // Mini Waffles
                {
                  name: 'Death by Chocolate Mini',
                  description: 'Ultimate chocolate experience',
                  price: 50,
                  category: 'mini_waffle',
                  size: 'regular'
                },
                {
                  name: 'Dark Choco Mini',
                  description: 'Rich dark chocolate waffle',
                  price: 50,
                  category: 'mini_waffle',
                  size: 'regular'
                },
                {
                  name: 'White Choco Mini',
                  description: 'Creamy white chocolate waffle',
                  price: 50,
                  category: 'mini_waffle',
                  size: 'regular'
                },
                {
                  name: 'Milk Choco Mini',
                  description: 'Classic milk chocolate waffle',
                  price: 50,
                  category: 'mini_waffle',
                  size: 'regular'
                },
                {
                  name: 'Butter Scotch Mini',
                  description: 'Sweet butterscotch flavored waffle',
                  price: 50,
                  category: 'mini_waffle',
                  size: 'regular'
                },
                // Belgian Waffles
                {
                  name: 'Death by Chocolate',
                  description: 'Ultimate chocolate experience',
                  price: 80,
                  category: 'belgian_waffle',
                  size: 'semi'
                },
                {
                  name: 'Dark Choco',
                  description: 'Rich dark chocolate waffle',
                  price: 80,
                  category: 'belgian_waffle',
                  size: 'semi'
                },
                {
                  name: 'White Choco',
                  description: 'Creamy white chocolate waffle',
                  price: 80,
                  category: 'belgian_waffle',
                  size: 'semi'
                },
                {
                  name: 'Milk Choco',
                  description: 'Classic milk chocolate waffle',
                  price: 80,
                  category: 'belgian_waffle',
                  size: 'semi'
                },
                {
                  name: 'Butter Scotch',
                  description: 'Sweet butterscotch flavored waffle',
                  price: 80,
                  category: 'belgian_waffle',
                  size: 'semi'
                },
                // Bubble Waffles
                {
                  name: 'Bubble Death by Chocolate',
                  description: 'Ultimate chocolate experience',
                  price: 150,
                  category: 'bubble_waffle',
                  size: 'large'
                },
                {
                  name: 'Bubble Dark Choco',
                  description: 'Rich dark chocolate waffle',
                  price: 150,
                  category: 'bubble_waffle',
                  size: 'large'
                },
                {
                  name: 'Bubble White Choco',
                  description: 'Creamy white chocolate waffle',
                  price: 150,
                  category: 'bubble_waffle',
                  size: 'large'
                },
                {
                  name: 'Bubble Milk Choco',
                  description: 'Classic milk chocolate waffle',
                  price: 150,
                  category: 'bubble_waffle',
                  size: 'large'
                },
                {
                  name: 'Bubble Butter Scotch',
                  description: 'Sweet butterscotch flavored waffle',
                  price: 150,
                  category: 'bubble_waffle',
                  size: 'large'
                }
              ];

              const { data: insertedData, error: insertError } = await supabase
                .from('menu_items')
                .insert(menuItems)
                .select();

              if (insertError) {
                console.error('Insert error:', insertError);
                throw insertError;
              }

              console.log('Inserted menu items:', insertedData);

              // Update the store with the inserted data
              set({ 
                menuItems: insertedData || [],
                loading: false 
              });

            } catch (err) {
              console.error('Error resetting menu items:', err);
              set({ loading: false });
              throw err;
            }
          }
        }),
        {
          name: 'waffle-store',
          storage: createJSONStorage(() => sessionStorage),
          partialize: (state) => ({ user: state.user }),
          version: 1,
          migrate: (persistedState: any) => {
            return {
              ...persistedState,
              version: 1
            }
          },
        }
      )
    )
  );
};

export const useStore = createStore();

// Remove or comment out this line since we don't need to check menu items on store creation
// useStore.getState().checkMenuItems(); 