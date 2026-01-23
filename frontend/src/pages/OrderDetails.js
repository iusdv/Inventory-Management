import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const money = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const items = useMemo(() => order?.order_items || order?.orderItems || [], [order]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Orders / Details</div>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{order?.order_number || 'Order'}</h3>
          <Link to="/orders" className="btn btn-secondary">Back</Link>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <div style={{ marginBottom: 10 }}><strong>Date:</strong> {order?.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Store:</strong> {order?.store?.name || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Order Status:</strong> {order?.order_status || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Payment Status:</strong> {order?.payment_status || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Payment Method:</strong> {order?.payment_method || 'N/A'}</div>
              </div>

              <div>
                <div style={{ marginBottom: 10 }}><strong>Customer:</strong> {order?.customer_name || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Email:</strong> {order?.customer_email || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Phone:</strong> {order?.customer_phone || 'N/A'}</div>
                <div style={{ marginBottom: 10 }}><strong>Address:</strong> {order?.customer_address || 'N/A'}</div>
              </div>

              <div>
                <div style={{ marginBottom: 10 }}><strong>Subtotal:</strong> ${money(order?.subtotal)}</div>
                <div style={{ marginBottom: 10 }}><strong>Tax:</strong> ${money(order?.tax)}</div>
                <div style={{ marginBottom: 10 }}><strong>Discount:</strong> ${money(order?.discount)}</div>
                <div style={{ marginBottom: 10 }}><strong>Total:</strong> ${money(order?.total)}</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={{ marginBottom: 10 }}>Items</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.length ? (
                      items.map((it) => (
                        <tr key={it.id}>
                          <td>{it?.product?.name || it?.product_name || 'N/A'}</td>
                          <td>{it?.quantity ?? 0}</td>
                          <td>${money(it?.price)}</td>
                          <td>${money(it?.total)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center' }}>No items</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {order?.notes ? (
              <div style={{ marginTop: 16 }}>
                <strong>Notes:</strong>
                <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{order.notes}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
