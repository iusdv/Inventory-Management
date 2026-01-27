import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { can } from '../services/permissions';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    phone: '',
    address: '',
    status: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/users'),
        api.get('/roles'),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      console.error('Error fetching users/roles:', error);
      // fallback so at least users load
      try {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      } catch (e) {
        console.error('Error fetching users:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultUserRoleId = () => {
    const userRole = roles.find((r) => (r?.name || '').toLowerCase() === 'user');
    return userRole?.id || '';
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (!payload.role_id) {
        payload.role_id = getDefaultUserRoleId();
      }

      if (!payload.role_id) {
        alert('Please select a role');
        return;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
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
        alert('Error saving user');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.group_id || user.role?.id || '',
      phone: user.phone || '',
      address: user.address || '',
      status: user.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role_id: getDefaultUserRoleId(),
      phone: '',
      address: '',
      status: true,
    });
    setEditingUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!can('users', 'view')) {
    return (
      <div className="card">
        <div className="error-message">You do not have permission to view users.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Users</div>
      <div className="card">
        <div className="card-header">
          <h3>Users Management</h3>
          {can('users', 'create') && (
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add User
            </button>
          )}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.name || user.role || 'N/A'}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${user.status ? 'success' : 'danger'}`}>
                      {user.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="action-icons">
                    {can('users', 'update') && (
                      <button className="icon-btn" onClick={() => handleEdit(user)} title="Edit">✏️</button>
                    )}
                    {can('users', 'delete') && (
                      <button className="icon-btn delete" onClick={() => handleDelete(user.id)} title="Delete">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && can('users', editingUser ? 'update' : 'create') && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add User'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {editingUser && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={8}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                />
              </div>
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
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
