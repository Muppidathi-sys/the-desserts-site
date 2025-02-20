export type UserRole = 'operator' | 'kitchen' | 'manager';

export type User = {
  user_id: string;
  username: string;
  role: UserRole;
  created_at: string;
};

export type MenuItem = {
  item_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string;
};

export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'completed';

export type Order = {
  order_id: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  created_by: string;
  items: OrderItem[];
  marked?: boolean;
};

export type OrderItem = {
  order_item_id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  special_instructions?: string;
  item_price: number;
  subtotal: number;
}; 