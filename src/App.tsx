import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App; 