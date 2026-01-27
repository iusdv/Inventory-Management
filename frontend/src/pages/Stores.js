import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    status: true,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await api.put(`/stores/${editingStore.id}`, formData);
      } else {
        await api.post('/stores', formData);
      }
      setShowModal(false);
      resetForm();
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      if (errors && typeof errors === 'object') {
        const lines = Object.values(errors)
          .flat()
          .filter(Boolean);
        alert(lines.join('\n'));
      } else if (message) {
        alert(message);
      } else {
        alert('Error saving store');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await api.delete(`/stores/${id}`);
        fetchStores();
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      location: store.location || '',
      manager: store.manager || '',
      address: store.address || '',
      city: store.city || '',
      zip: store.zip || '',
      phone: store.phone || '',
      email: store.email || '',
      status: store.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', manager: '', address: '', city: '', zip: '', phone: '', email: '', status: true });
    setEditingStore(null);
  };

  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Stores</div>
      <div className="card">
        <div className="card-header">
          <h3>Manage Stores</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Store
          </button>
        </div>
        <div className="search-row">
          <span>Search:</span>
          <input type="text" placeholder="Search stores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Location</th>
                <th>Manager</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.location || 'N/A'}</td>
                  <td>{store.manager || 'N/A'}</td>
                  <td className="text-primary">{store.phone || 'N/A'}</td>
                  <td><span className={`badge badge-${store.status ? 'success' : 'danger'}`}>{store.status ? 'Active' : 'Inactive'}</span></td>
                  <td className="action-icons">
                    <button className="icon-btn" onClick={() => handleEdit(store)} title="Edit">✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(store.id)} title="Delete">🗑️</button>
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
              <h3>{editingStore ? 'Edit Store' : 'Add Store'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Store Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group"><label>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
              <div className="form-group"><label>Manager</label><input type="text" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} /></div>
              <div className="form-group"><label>Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
              <div className="form-group"><label>City</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
              <div className="form-group"><label>Zip</label><input type="text" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} /></div>
              <div className="form-group"><label>Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
              <div className="form-group switch-wrapper">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="switch-label">Active</span>
              </div>
              <button type="submit" className="btn btn-primary">{editingStore ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
