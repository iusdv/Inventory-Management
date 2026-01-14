import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: '',
    description: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await api.put(`/groups/${editingGroup.id}`, formData);
      } else {
        await api.post('/groups', formData);
      }
      setShowModal(false);
      resetForm();
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Error saving group');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await api.delete(`/groups/${id}`);
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      permissions: group.permissions || '',
      description: group.description || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      permissions: '',
      description: '',
    });
    setEditingGroup(null);
  };

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Groups</div>
      
      <div className="card">
        <div className="card-header">
          <h3>Manage Groups</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Group
          </button>
        </div>
        
        <div className="search-row">
          <span>Search:</span>
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Permissions</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => (
                <tr key={group.id}>
                  <td className="text-primary">{group.name}</td>
                  <td className="text-primary">{group.permissions || 'None'}</td>
                  <td>{group.users_count || 0}</td>
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
              <h3>{editingGroup ? 'Edit Group' : 'Add Group'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Permissions</label>
                <input
                  type="text"
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  placeholder="e.g., Read, Write, Update"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingGroup ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
