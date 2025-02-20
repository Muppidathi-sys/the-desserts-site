import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { CreateOrderPage } from './pages/CreateOrderPage';
import { Users } from './pages/Users';
import { Debug } from './pages/Debug';

// Create a separate component for routes that uses useLocation
function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = () => {
      switch (location.pathname) {
        case '/':
          return 'Orders - The Desserts Site';
        case '/new-order':
          return 'New Order - The Desserts Site';
        case '/history':
          return 'Order History - The Desserts Site';
        case '/reports':
          return 'Reports - The Desserts Site';
        case '/profile':
          return 'Profile - The Desserts Site';
        default:
          return 'The Desserts Site';
      }
    };

    document.title = getPageTitle();
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        } />
        <Route path="/new-order" element={
          <PrivateRoute>
            <CreateOrderPage />
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        } />
        <Route path="/debug" element={
          <PrivateRoute>
            <Debug />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

// Main App component that provides the Router context
export function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App; 