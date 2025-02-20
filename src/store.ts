import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from './lib/supabase';
import { User, Order, MenuItem } from './types';
import { useStore } from './store';

interface State {
  users: User[];
  user: User | null;
  orders: Order[];
  menuItems: MenuItem[];
  loading: boolean;
}

interface Actions {
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  setMenuItems: (items: MenuItem[]) => void;
  addUser: (user: User) => Promise<void>;
  setUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  clearOrders: () => Promise<void>;
  clearAllData: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  resetMenuItems: () => Promise<void>;
}

const store = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        users: [],
        user: null,
        orders: [],
        menuItems: [],
        loading: false,

        setOrders: (orders) => set({ orders }),
        setMenuItems: (menuItems) => set({ menuItems }),
        setUser: (user) => set({ user }),

        addOrder: async (order) => {
          try {
            // Get current user
            const { user } = useStore.getState();
            if (!user || !user.user_id) {
              throw new Error('No authenticated user found');
            }

            // First create the order
            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .insert({
                order_number: order.order_number,
                status: 'new',
                total_amount: order.total_amount,
                notes: order.notes || '',
                created_by: user.user_id, // Use the actual user UUID
                payment_method: order.payment_method || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (orderError) {
              console.error('Error creating order:', orderError);
              throw orderError;
            }

            console.log('Created order:', orderData);

            // Then create the order items
            const orderItems = order.items.map(item => ({
              order_id: orderData.order_id,
              item_id: item.item_id,
              quantity: item.quantity,
              item_price: item.item_price,
              subtotal: item.quantity * item.item_price,
              special_instructions: item.special_instructions || ''
            }));

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems);

            if (itemsError) {
              console.error('Error creating order items:', itemsError);
              throw itemsError;
            }

            // Update local state with the new order
            set((state) => ({
              orders: [...state.orders, {
                ...orderData,
                items: order.items
              }]
            }));

            return orderData;
          } catch (err) {
            console.error('Error in addOrder:', err);
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
              orders: state.orders.map(o => 
                o.order_id === order.order_id ? order : o
              )
            }));
          } catch (err) {
            console.error('Error updating order:', err);
            throw err;
          }
        },

        fetchAllData: async () => {
          set({ loading: true });
          try {
            // Fetch users
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .order('created_at', { ascending: false });

            if (userError) throw userError;

            // Fetch menu items
            const { data: menuData, error: menuError } = await supabase
              .from('menu_items')
              .select('*')
              .order('category', { ascending: true });

            if (menuError) throw menuError;

            // Fetch orders with related data
            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .select(`
                *,
                items:order_items(
                  *,
                  menu_item:menu_items(*)
                ),
                created_by:users!created_by(username)
              `)
              .order('created_at', { ascending: false });

            if (orderError) throw orderError;

            // Update store with all fetched data
            set({
              users: userData || [],
              menuItems: menuData || [],
              orders: orderData?.map(order => ({
                ...order,
                items: order.items.map((item: any) => ({
                  ...item,
                  name: item.menu_item.name
                }))
              })) || [],
              loading: false
            });

            console.log('Fetched Data:', {
              users: userData,
              menuItems: menuData,
              orders: orderData
            });

          } catch (err) {
            console.error('Error fetching all data:', err);
            set({ loading: false });
            throw err;
          }
        },

        fetchUsers: async () => {
          set({ loading: true });
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .order('created_at', { ascending: false });

            if (error) throw error;
            console.log('Fetched Users:', data);
            set({ users: data || [], loading: false });
          } catch (err) {
            console.error('Error fetching users:', err);
            set({ loading: false });
            throw err;
          }
        },

        fetchMenuItems: async () => {
          set({ loading: true });
          try {
            const { data, error } = await supabase
              .from('menu_items')
              .select('*')
              .order('category', { ascending: true });

            if (error) {
              console.error('Error fetching menu items:', error);
              throw error;
            }

            set({ menuItems: data || [], loading: false });
          } catch (err) {
            console.error('Error in fetchMenuItems:', err);
            set({ loading: false });
            throw err;
          }
        },

        fetchOrders: async () => {
          set({ loading: true });
          try {
            const { data, error } = await supabase
              .from('orders')
              .select(`
                *,
                items:order_items(
                  *,
                  menu_item:menu_items(*)
                ),
                created_by:users!created_by(username)
              `)
              .order('created_at', { ascending: false });

            if (error) throw error;
            console.log('Fetched Orders:', data);

            set({ 
              orders: data?.map(order => ({
                ...order,
                items: order.items.map((item: any) => ({
                  ...item,
                  name: item.menu_item.name
                }))
              })) || [],
              loading: false 
            });
          } catch (err) {
            console.error('Error fetching orders:', err);
            set({ loading: false });
            throw err;
          }
        },

        clearOrders: async () => {
          try {
            set({ loading: true });
            
            await supabase.from('order_items').delete().neq('order_item_id', '');
            await supabase.from('orders').delete().neq('order_id', '');
            
            set({ orders: [], loading: false });
          } catch (err) {
            console.error('Error clearing orders:', err);
            set({ loading: false });
            throw err;
          }
        },

        clearAllData: async () => {
          try {
            set({ loading: true });
            
            await supabase.from('order_items').delete().neq('order_item_id', '');
            await supabase.from('orders').delete().neq('order_id', '');
            await supabase.from('menu_items').delete().neq('item_id', '');
            
            set({ 
              orders: [],
              menuItems: [],
              loading: false 
            });
          } catch (err) {
            console.error('Error clearing all data:', err);
            set({ loading: false });
            throw err;
          }
        },

        checkMenuItems: async () => {
          const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('category', { ascending: true });

          if (error) {
            console.error('Error fetching menu items:', error);
            return;
          }

          console.log('Menu Items:', data);
          return data;
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
      }
    )
  )
);

export const useStore = store;

// Call this function to verify
useStore.getState().checkMenuItems(); 