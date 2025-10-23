import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    brand_id: '',
    price: '',
    cost: '',
    quantity: '',
    min_quantity: '',
    status: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/brands'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category_id: product.category_id || '',
      brand_id: product.brand_id || '',
      price: product.price,
      cost: product.cost,
      quantity: product.quantity,
      min_quantity: product.min_quantity || '',
      status: product.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      category_id: '',
      brand_id: '',
      price: '',
      cost: '',
      quantity: '',
      min_quantity: '',
      status: true,
    });
    setEditingProduct(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3>Products</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add Product
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>{product.brand?.name || 'N/A'}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span className={`badge badge-${product.status ? 'success' : 'danger'}`}>
                      {product.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(product)} style={{ marginRight: '5px' }}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}>
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Cost</label>
                <input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Min Quantity</label>
                <input type="number" value={formData.min_quantity} onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
