import { User, Order, MenuItem } from '../types';

export interface StoreState {
  user: User | null;
  users: User[];
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
  resetMenuItems: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
} 