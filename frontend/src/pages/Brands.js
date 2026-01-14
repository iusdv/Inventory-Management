import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: true,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await api.put(`/brands/${editingBrand.id}`, formData);
      } else {
        await api.post('/brands', formData);
      }
      setShowModal(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error saving brand');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await api.delete(`/brands/${id}`);
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      status: brand.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: true });
    setEditingBrand(null);
  };

  const filteredBrands = brands.filter(brand =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Brands</div>
      <div className="card">
        <div className="card-header">
          <h3>Manage Brands</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Brand
          </button>
        </div>
        <div className="search-row">
          <span>Search:</span>
          <input type="text" placeholder="Search brands..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.id}>
                  <td className="text-primary">{brand.name}</td>
                  <td>{brand.description || 'N/A'}</td>
                  <td><span className={`badge badge-${brand.status ? 'success' : 'danger'}`}>{brand.status ? 'Active' : 'Inactive'}</span></td>
                  <td className="action-icons">
                    <button className="icon-btn" onClick={() => handleEdit(brand)} title="Edit">✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(brand.id)} title="Delete">🗑️</button>
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
              <h3>{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Brand Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" /></div>
              <div className="form-group"><label><input type="checkbox" checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} /> Active</label></div>
              <button type="submit" className="btn btn-primary">{editingBrand ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
