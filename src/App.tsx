import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { CreateOrderPage } from './pages/CreateOrderPage';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Orders />} />
              <Route path="/new-order" element={<CreateOrderPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App; 