import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Products</h4>
          <div className="value">{stats?.stats?.totalProducts || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Total Orders</h4>
          <div className="value">{stats?.stats?.totalOrders || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Total Users</h4>
          <div className="value">{stats?.stats?.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <div className="value">${stats?.stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Orders</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.customer_name}</td>
                    <td>${order.total}</td>
                    <td>
                      <span className={`badge badge-${order.order_status === 'completed' ? 'success' : 'warning'}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Low Stock Products</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Min Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stats?.lowStockProducts?.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>
                      <span className="badge badge-danger">{product.quantity}</span>
                    </td>
                    <td>{product.min_quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No low stock products</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
