export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'gpay';

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  item_id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
  menu_item?: MenuItem;
}

export interface Order {
  order_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  payment_method?: PaymentMethod;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface MenuItem {
  item_id: string;
  name: string;
  description: string;
  price: number;
  category: 'mini_waffle' | 'belgian_waffle' | 'bubble_waffle';
  size: 'regular' | 'semi' | 'large';
  created_at: string;
}

export interface User {
  user_id: string;
  auth_id?: string;
  username: string;
  email?: string;
  role: 'manager' | 'operator' | 'kitchen';
  phone?: string;
  avatar_url?: string;
  created_at: string;
}