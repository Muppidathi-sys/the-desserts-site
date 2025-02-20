# Food Cart Order Management System Context

## Project Overview
This application serves as an internal tool for food cart employees to manage customer orders efficiently. It focuses on simplicity, speed, and reliability in potentially limited-connectivity environments.

## User Personas
- **Cart Operators**: Staff who take customer orders and update their status
- **Kitchen Staff**: Prepare orders and update status to "Ready"
- **Managers**: Need access to order history and basic reporting

## Core Functionality Requirements

### Order Creation
- Allow quick selection of menu items from predefined list
- Support quantity adjustments per item
- Enable special instructions per item
- Auto-generate sequential order numbers
- Calculate order totals automatically

### Order Status Workflow
- Status progression: New → In Progress → Ready → Completed
- Each status change requires single-click operation
- Clear visual differentiation between statuses (color coding)
- Status changes trigger automatic timestamps

### Order History & Management
- Maintain searchable history of all orders
- Filter by date range, status, or order contents
- Basic reporting on popular items and busy periods
- Secure access to historical data

### UI/UX Requirements
- Touch-optimized interface with large tap targets
- Minimalist design focusing on essential information
- High-contrast visuals for outdoor visibility
- Tab-based navigation between active orders and history
- Quick-access buttons for common actions

## Technical Specifications

### Architecture
- React-based frontend for responsive UI
- Supabase integration for:
  - Authentication (role-based access)
  - Real-time database functionality
  - Offline data synchronization
  - Secure API endpoints

### Database Schema (Supabase)
1. **Users Table**
   - user_id (PK)
   - username
   - password_hash
   - role (operator, kitchen, manager)
   - created_at

2. **Menu Items Table**
   - item_id (PK)
   - name
   - description
   - price
   - category
   - available (boolean)
   - image_url (optional)

3. **Orders Table**
   - order_id (PK)
   - order_number (displayed to customers)
   - created_at
   - updated_at
   - status (new, in_progress, ready, completed)
   - total_amount
   - notes
   - created_by (FK to users)

4. **Order Items Table**
   - order_item_id (PK)
   - order_id (FK to orders)
   - item_id (FK to menu_items)
   - quantity
   - special_instructions
   - item_price (price at time of order)
   - subtotal

### Authentication Requirements
- Simple username/password authentication
- Role-based access control:
  - Operators: Create orders, update status
  - Kitchen staff: Update order status
  - Managers: Full access including history and reporting
- Secure session management
- Offline authentication capabilities

### Offline Functionality
- Local storage for active orders
- Queued synchronization when connectivity returns
- Conflict resolution for simultaneous edits

## Implementation Considerations

### Performance Targets
- Order creation in under 15 seconds
- Status updates in under 2 seconds
- Application load time under 3 seconds

### Deployment Strategy
- Progressive Web App (PWA) for cross-platform compatibility
- Service workers for offline functionality
- Local-first data architecture with background synchronization

### Testing Requirements
- Component testing for UI elements
- Integration testing for order workflow
- Offline functionality testing
- Performance testing under various network conditions

## Future Expansion Possibilities
- Customer notification system
- Integration with payment processing
- Inventory management
- Advanced analytics and reporting
- Multi-location support

## Setup and Run Instructions

1. First, create a new directory and initialize the project:
```bash
mkdir food-cart-manager
cd food-cart-manager
```

2. Create a new Vite project with React and TypeScript:
```bash
npm create vite@latest . -- --template react-ts
```

3. Install the required dependencies from package.json:
```bash
npm install react-router-dom@6.20.0 zustand@4.4.7 class-variance-authority@0.7.0 tailwindcss@3.3.5 clsx@2.0.0
```

4. Install dev dependencies:
```bash
npm install -D autoprefixer@10.4.16 postcss@8.4.31
```

5. Initialize Tailwind CSS:
```bash
npx tailwindcss init -p
```

6. Create the following directory structure:
```
src/
├── components/
│   ├── Layout.tsx
│   └── PrivateRoute.tsx
├── lib/
│   └── mockData.ts
├── pages/
│   ├── Login.tsx
│   ├── Orders.tsx
│   ├── History.tsx
│   └── Reports.tsx
├── store/
│   └── index.ts
├── types/
│   └── index.ts
├── App.tsx
└── index.css
```

7. Copy all the provided code files into their respective locations:
- `src/types/index.ts` - Type definitions
- `src/store/index.ts` - Zustand store
- `src/lib/mockData.ts` - Mock data
- `src/components/Layout.tsx` - Layout component
- `src/components/PrivateRoute.tsx` - Auth protection
- `src/pages/*` - Page components
- `src/App.tsx` - Main app component
- `src/index.css` - Tailwind imports

8. Run the development server:
```bash
npm run dev
```

9. Access the application:
- Open your browser and navigate to `http://localhost:5173`
- Login using these credentials:
  - Username: `operator`, `kitchen`, or `manager`
  - Password: `password` (same for all users)

Each user role has different permissions:
- **Operator**: Create and manage orders
- **Kitchen**: Update order statuses
- **Manager**: Full access including reports

The application currently demonstrates:
- User authentication (mock)
- Order management interface
- Role-based access control
- Responsive design with Tailwind CSS