import { User, Order } from '../types';

export const mockUsers: User[] = [
  {
    user_id: '1',
    username: 'Manager',
    role: 'manager',
    created_at: new Date().toISOString(),
    phone: '9876543210'
  },
  {
    user_id: '2',
    username: 'Kitchen Staff',
    role: 'kitchen',
    created_at: new Date().toISOString(),
    phone: '9876543211'
  },
  {
    user_id: '3',
    username: 'Operator',
    role: 'operator',
    created_at: new Date().toISOString(),
    phone: '9876543212'
  }
];

export const mockMenuItems = [
  // Mini Waffles
  {
    item_id: '1',
    name: 'Death by Chocolate Mini',
    description: 'Ultimate chocolate experience',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '2',
    name: 'Dark Choco Mini',
    description: 'Rich dark chocolate waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '3',
    name: 'White Choco Mini',
    description: 'Creamy white chocolate waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '4',
    name: 'Milk Choco Mini',
    description: 'Classic milk chocolate waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '5',
    name: 'Butter Scotch Mini',
    description: 'Sweet butterscotch flavored waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '6',
    name: 'Cotton Candy Mini',
    description: 'Fun cotton candy flavored waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '7',
    name: 'Gems Mafia Mini',
    description: 'Colorful gems topped waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '8',
    name: 'Nutella Mini',
    description: 'Classic Nutella spread waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '9',
    name: 'Cookies N Cream Mini',
    description: 'Crushed cookies and cream waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '10',
    name: 'Crunchy Mini',
    description: 'KitKat topped crunchy waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '11',
    name: 'Oreo Cookies Mini',
    description: 'Oreo cookies topped waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '12',
    name: 'Mango Mafia Mini',
    description: 'Fresh mango flavored waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },
  {
    item_id: '13',
    name: 'Strawberry Surprise Mini',
    description: 'Sweet strawberry flavored waffle',
    price: 50,
    category: 'mini_waffle',
    size: 'regular'
  },

  // Belgian Waffles - Same items with different price
  {
    item_id: '14',
    name: 'Death by Chocolate',
    description: 'Ultimate chocolate experience',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '15',
    name: 'Dark White Choco',
    description: 'Rich dark and white chocolate combination',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '16',
    name: 'Triple Choco',
    description: 'Three layers of chocolate delight',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '17',
    name: 'Red Velvet',
    description: 'Classic red velvet with cream cheese',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '18',
    name: 'Black Galaxy',
    description: 'Dark chocolate with galaxy sprinkles',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '19',
    name: 'Dutch Choco',
    description: 'Premium Dutch chocolate blend',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '20',
    name: 'Nutty Nutella',
    description: 'Hazelnut Nutella spread with nuts',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '21',
    name: 'Nuts',
    description: 'Mixed nuts topping',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '22',
    name: 'Gems',
    description: 'Colorful chocolate gems',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '23',
    name: 'White Choco Chips',
    description: 'Premium white chocolate chips',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '24',
    name: 'Dark Choco Chips',
    description: 'Premium dark chocolate chips',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '25',
    name: 'Kitkat',
    description: 'Crushed Kitkat pieces',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '26',
    name: 'Oreo',
    description: 'Crushed Oreo cookies',
    price: 80,
    category: 'belgian_waffle',
    size: 'regular'
  },
  {
    item_id: '27',
    name: 'Bubble Dark White Choco',
    description: 'Rich dark and white chocolate combination',
    price: 90,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '28',
    name: 'Bubble Triple Choco',
    description: 'Three layers of chocolate delight',
    price: 90,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '29',
    name: 'Red Velvet',
    description: 'Classic red velvet with cream cheese',
    price: 90,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '30',
    name: 'Candy Joy',
    description: 'Sweet candy topped waffle',
    price: 100,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '31',
    name: 'Dark Galaxy',
    description: 'Dark chocolate with galaxy sprinkles',
    price: 100,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '32',
    name: 'White Galaxy',
    description: 'White chocolate with galaxy sprinkles',
    price: 100,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '33',
    name: 'Dark White Galaxy',
    description: 'Dark and white chocolate with galaxy sprinkles',
    price: 100,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '34',
    name: 'Nuts & Nutella',
    description: 'Nutella spread with mixed nuts',
    price: 100,
    category: 'bubble_waffle',
    size: 'semi'
  },
  {
    item_id: '35',
    name: 'Bubble Dark White Choco',
    description: 'Rich dark and white chocolate combination',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '36',
    name: 'Triple Choco',
    description: 'Three layers of chocolate delight',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '37',
    name: 'Red Velvet',
    description: 'Classic red velvet with cream cheese',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '38',
    name: 'Black Galaxy',
    description: 'Dark chocolate with galaxy sprinkles',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '39',
    name: 'Dutch Choco',
    description: 'Premium Dutch chocolate blend',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '40',
    name: 'Nutty Nutella',
    description: 'Hazelnut Nutella spread with nuts',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '41',
    name: 'Nuts',
    description: 'Mixed nuts topping',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '42',
    name: 'Gems',
    description: 'Colorful chocolate gems',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '43',
    name: 'White Choco Chips',
    description: 'Premium white chocolate chips',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '44',
    name: 'Dark Choco Chips',
    description: 'Premium dark chocolate chips',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '45',
    name: 'Kitkat',
    description: 'Crushed Kitkat pieces',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '46',
    name: 'Oreo',
    description: 'Crushed Oreo cookies',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '47',
    name: 'Sprinkles',
    description: 'Rainbow sprinkles',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  },
  {
    item_id: '48',
    name: 'Marshmallow',
    description: 'Mini marshmallows',
    price: 150,
    category: 'bubble_waffle',
    size: 'large'
  }
];

export const mockOrders: Order[] = [
  {
    order_id: '1',
    order_number: '001',
    created_at: '2024-02-20T10:30:00Z',
    updated_at: '2024-02-20T10:35:00Z',
    status: 'completed',
    total_amount: 200,
    created_by: '1',
    items: [
      {
        order_item_id: '1',
        order_id: '1',
        item_id: '1',
        name: 'Death by Chocolate Mini',
        quantity: 4,
        item_price: 50,
        subtotal: 200,
      }
    ],
  },
  {
    order_id: '2',
    order_number: '002',
    created_at: '2024-02-20T11:00:00Z',
    updated_at: '2024-02-20T11:05:00Z',
    status: 'new',
    total_amount: 300,
    created_by: '1',
    items: [
      {
        order_item_id: '2',
        order_id: '2',
        item_id: '27',
        name: 'Bubble Dark White Choco',
        quantity: 2,
        item_price: 90,
        subtotal: 180,
      },
      {
        order_item_id: '3',
        order_id: '2',
        item_id: '35',
        name: 'Bubble Dark White Choco',
        quantity: 1,
        item_price: 150,
        subtotal: 120,
      }
    ],
  },
  {
    order_id: '3',
    order_number: '003',
    created_at: '2024-02-20T11:30:00Z',
    updated_at: '2024-02-20T11:40:00Z',
    status: 'processing',
    total_amount: 160,
    created_by: '1',
    items: [
      {
        order_item_id: '4',
        order_id: '3',
        item_id: '14',
        name: 'Death by Chocolate',
        quantity: 2,
        item_price: 80,
        subtotal: 160,
      }
    ],
  }
]; 