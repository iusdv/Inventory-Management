import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dropdown',
    values: '',
    status: true,
  });

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await api.get('/attributes');
      setAttributes(response.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedType = formData.type === 'dropdown' ? 'select' : formData.type;
      const valuesString = (formData.values ?? '').toString();
      const valuesArray = valuesString
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        type: normalizedType,
        values: valuesArray.length ? valuesArray : null,
        status: !!formData.status,
      };

      if (editingAttribute) {
        await api.put(`/attributes/${editingAttribute.id}`, payload);
      } else {
        await api.post('/attributes', payload);
      }
      setShowModal(false);
      resetForm();
      fetchAttributes();
    } catch (error) {
      console.error('Error saving attribute:', error);
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
        alert('Error saving attribute');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        await api.delete(`/attributes/${id}`);
        fetchAttributes();
      } catch (error) {
        console.error('Error deleting attribute:', error);
      }
    }
  };

  const handleEdit = (attr) => {
    setEditingAttribute(attr);

    const valuesString = Array.isArray(attr.values)
      ? attr.values.join(', ')
      : (attr.values || '');

    setFormData({
      name: attr.name,
      type: attr.type === 'select' ? 'dropdown' : (attr.type || 'dropdown'),
      values: valuesString,
      status: typeof attr.status === 'boolean' ? attr.status : true,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'dropdown', values: '', status: true });
    setEditingAttribute(null);
  };

  const filteredAttributes = attributes.filter(attr =>
    attr.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Attributes</div>
      <div className="card">
        <div className="card-header">
          <h3>Manage Attributes</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Attribute
          </button>
        </div>
        <div className="search-row">
          <span>Search:</span>
          <input type="text" placeholder="Search attributes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Attribute Name</th>
                <th>Type</th>
                <th>Values</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.map((attr) => (
                <tr key={attr.id}>
                  <td>{attr.name}</td>
                  <td>{attr.type || 'Text'}</td>
                  <td>{attr.values || 'N/A'}</td>
                  <td><span className={`badge badge-${attr.status ? 'success' : 'danger'}`}>{attr.status ? 'Active' : 'Inactive'}</span></td>
                  <td className="action-icons">
                    <button className="icon-btn" onClick={() => handleEdit(attr)} title="Edit">✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(attr.id)} title="Delete">🗑️</button>
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
              <h3>{editingAttribute ? 'Edit Attribute' : 'Add Attribute'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Attribute Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="dropdown">Dropdown</option>
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                </select>
              </div>
              <div className="form-group"><label>Values (comma separated)</label><input type="text" value={formData.values} onChange={(e) => setFormData({ ...formData, values: e.target.value })} placeholder="e.g., Red, Blue, Green" /></div>
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
              <button type="submit" className="btn btn-primary">{editingAttribute ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attributes;
