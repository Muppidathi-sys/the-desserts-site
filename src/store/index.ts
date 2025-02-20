import { create } from 'zustand';
import { User, Order, MenuItem } from '../types';

interface AppState {
  user: User | null;
  orders: Order[];
  menuItems: MenuItem[];
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  setMenuItems: (items: MenuItem[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  orders: [],
  menuItems: [],
  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
  setMenuItems: (items) => set({ menuItems: items }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (order) => set((state) => ({
    orders: state.orders.map((o) => (o.order_id === order.order_id ? order : o))
  }))
})); 