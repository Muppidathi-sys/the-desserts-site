export interface OrderItem {
  order_item_id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  item_price: number; // In INR
  subtotal: number; // In INR
  special_instructions?: string;
  name?: string; // Added after joining with menu_items
}

export interface Order {
  order_id: string;
  order_number: string;
  status: 'new' | 'in_progress' | 'completed';
  total_amount: number;
  notes?: string;
  payment_method?: 'cash' | 'gpay';
  created_by: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface MenuItem {
  item_id: string;
  name: string;
  description: string;
  price: number; // In INR
  category: 'mini_waffle' | 'belgian_waffle' | 'bubble_waffle';
  size: 'regular' | 'semi' | 'large';
  created_at: string;
}

export interface User {
  user_id: string;
  auth_id?: string;
  username: string;
  role: 'manager' | 'operator' | 'kitchen';
  phone?: string;
  created_at: string;
} 