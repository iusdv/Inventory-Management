import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from "./pages/Categories";
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import OrderDetails from './pages/OrderDetails';
import { Roles, Brands, Stores, Attributes, Orders, Reports, Company, Profile, Settings } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="app">
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/roles" element={<Roles />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/stores" element={<Stores />} />
                      <Route path="/attributes" element={<Attributes />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/company" element={<Company />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
