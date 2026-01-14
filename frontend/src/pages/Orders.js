import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-shipped';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Orders</div>
      <div className="card">
        <div className="card-header">
          <h3>Manage Orders</h3>
        </div>
        <div className="search-row">
          <span>Search:</span>
          <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="text-primary">{order.order_number}</td>
                  <td className="text-primary">{order.customer_name}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className={order.items_count <= 1 ? 'text-warning' : ''}>{order.items_count || order.order_items?.length || 0}</td>
                  <td>${parseFloat(order.total || 0).toFixed(2)}</td>
                  <td><span className={`badge ${getStatusClass(order.order_status)}`}>{order.order_status}</span></td>
                  <td className="action-icons">
                    <button className="icon-btn" title="View">👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
