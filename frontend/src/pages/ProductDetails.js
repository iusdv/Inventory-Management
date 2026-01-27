import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Products / Details</div>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{product?.name || 'Product'}</h3>
          <Link to="/products" className="btn btn-secondary">Back</Link>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 10 }}><strong>SKU:</strong> {product?.sku || 'N/A'}</div>
            <div style={{ marginBottom: 10 }}><strong>Category:</strong> {product?.category?.name || 'N/A'}</div>
            <div style={{ marginBottom: 10 }}><strong>Brand:</strong> {product?.brand?.name || 'N/A'}</div>
            <div style={{ marginBottom: 10 }}><strong>Price:</strong> {product?.price ?? 'N/A'}</div>
            <div style={{ marginBottom: 10 }}><strong>Quantity:</strong> {product?.quantity ?? 'N/A'}</div>
            <div style={{ marginTop: 16 }}>
              <strong>Description:</strong>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                {product?.description || 'No description'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
