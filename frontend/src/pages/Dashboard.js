import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StatBoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const StatCartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05H4l2.66 12.63a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.61L23 6H6.78" />
  </svg>
);

const StatUsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

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

  const formatPctChange = (pct) => {
    if (pct === null || pct === undefined || Number.isNaN(Number(pct))) {
      return { text: '—', className: 'stat-neutral' };
    }

    const value = Number(pct);
    if (value > 0) return { text: `↗ +${value.toFixed(1)}%`, className: 'stat-positive' };
    if (value < 0) return { text: `↘ ${value.toFixed(1)}%`, className: 'stat-negative' };
    return { text: '→ 0.0%', className: 'stat-neutral' };
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-shipped';
      default: return 'badge-warning';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your inventory management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-content">
            <h4>Total Products</h4>
            <div className="value">{stats?.stats?.totalProducts ?? 0}</div>
            {(() => {
              const c = formatPctChange(stats?.stats?.productsChangePct);
              return <div className={`stat-change ${c.className}`}>{c.text}</div>;
            })()}
          </div>
          <div className="stat-icon stat-icon-blue"><StatBoxIcon /></div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-content">
            <h4>Total Orders</h4>
            <div className="value">{stats?.stats?.totalOrders ?? 0}</div>
            {(() => {
              const c = formatPctChange(stats?.stats?.ordersChangePct);
              return <div className={`stat-change ${c.className}`}>{c.text}</div>;
            })()}
          </div>
          <div className="stat-icon stat-icon-green"><StatCartIcon /></div>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-content">
            <h4>Total Users</h4>
            <div className="value">{stats?.stats?.totalUsers ?? 0}</div>
            {(() => {
              const c = formatPctChange(stats?.stats?.usersChangePct);
              return <div className={`stat-change ${c.className}`}>{c.text}</div>;
            })()}
          </div>
          <div className="stat-icon stat-icon-purple"><StatUsersIcon /></div>
        </div>
        <div className="stat-card stat-card-orange">
          <div className="stat-content">
            <h4>Revenue</h4>
            <div className="value">${Number(stats?.stats?.totalRevenue ?? 0).toLocaleString()}</div>
            {(() => {
              const c = formatPctChange(stats?.stats?.revenueChangePct);
              return <div className={`stat-change ${c.className}`}>{c.text}</div>;
            })()}
          </div>
          <div className="stat-icon stat-icon-orange"><span className="stat-icon-dollar">$</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Recent Orders</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.customer_name || order?.user?.name || '—'}</td>
                      <td>${Number(order.total || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusClass(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ opacity: 0.75 }}>
                      No recent orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Low Stock Alert</h3>
          <div className="low-stock-list">
            {stats?.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.slice(0, 4).map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <div className="low-stock-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product?.category?.name || product?.category_name || '—'}</div>
                  </div>
                  <div className="low-stock-status">
                    <div className="stock-count">Stock: {product.quantity ?? 0}</div>
                    <div className="stock-label">Low</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ opacity: 0.75, padding: '8px 0' }}>No low-stock products.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
