import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* CHANGED: w-full, removed max-w and mx-auto constraints */}
        <div className="w-full min-h-screen bg-white relative flex flex-col md:flex-row">
          
          {/* Sidebar (Desktop Only) */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            
            {/* Bottom Nav (Mobile Only) */}
            <BottomNav />
          </div>

        </div>
      </Router>
    </CartProvider>
  );
}

export default App;