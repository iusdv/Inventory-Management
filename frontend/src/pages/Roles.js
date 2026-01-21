import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { can } from '../services/permissions';

const RESOURCES = [
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'brands', label: 'Brands' },
  { key: 'categories', label: 'Category' },
  { key: 'stores', label: 'Stores' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'reports', label: 'Reports' },
  { key: 'company', label: 'Company' },
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Setting' },
];

const ACTIONS = [
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Update' },
  { key: 'view', label: 'View' },
  { key: 'delete', label: 'Delete' },
];

const buildEmptyPermissions = () => {
  const permissions = {};
  RESOURCES.forEach((r) => {
    permissions[r.key] = {};
    ACTIONS.forEach((a) => {
      permissions[r.key][a.key] = false;
    });
  });
  return permissions;
};

const normalizePermissions = (permissions) => {
  const base = buildEmptyPermissions();
  if (!permissions || typeof permissions !== 'object') return base;

  const result = { ...base };
  for (const resourceKey of Object.keys(base)) {
    const resource = permissions[resourceKey];
    if (!resource || typeof resource !== 'object') continue;
    for (const actionKey of Object.keys(base[resourceKey])) {
      if (typeof resource[actionKey] === 'boolean') {
        result[resourceKey][actionKey] = resource[actionKey];
      }
    }
  }

  return result;
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: buildEmptyPermissions(),
  });

  const filteredRoles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => (r.name || '').toLowerCase().includes(q));
  }, [roles, searchTerm]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: buildEmptyPermissions(),
    });
    setEditingRole(null);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name || '',
      description: role.description || '',
      permissions: normalizePermissions(role.permissions),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      const message = error?.response?.data?.message;
      alert(message || 'Error deleting role');
    }
  };

  const setPermission = (resourceKey, actionKey, value) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [resourceKey]: {
          ...prev.permissions[resourceKey],
          [actionKey]: value,
        },
      },
    }));
  };

  const buildFilledPermissions = (value) => {
    const permissions = {};
    RESOURCES.forEach((r) => {
      permissions[r.key] = {};
      ACTIONS.forEach((a) => {
        permissions[r.key][a.key] = value;
      });
    });
    return permissions;
  };

  const setAllPermissions = (value) => {
    setFormData((prev) => ({
      ...prev,
      permissions: buildFilledPermissions(value),
    }));
  };

  const setResourcePermissions = (resourceKey, value) => {
    setFormData((prev) => {
      const next = { ...(prev.permissions || buildEmptyPermissions()) };
      next[resourceKey] = { ...(next[resourceKey] || {}) };
      ACTIONS.forEach((a) => {
        next[resourceKey][a.key] = value;
      });
      return { ...prev, permissions: next };
    });
  };

  const setActionPermissions = (actionKey, value) => {
    setFormData((prev) => {
      const next = { ...(prev.permissions || buildEmptyPermissions()) };
      RESOURCES.forEach((r) => {
        next[r.key] = { ...(next[r.key] || {}) };
        next[r.key][actionKey] = value;
      });
      return { ...prev, permissions: next };
    });
  };

  const allSelected = useMemo(() => {
    return RESOURCES.every((r) => ACTIONS.every((a) => !!formData.permissions?.[r.key]?.[a.key]));
  }, [formData.permissions]);

  const resourceAllSelected = (resourceKey) => {
    return ACTIONS.every((a) => !!formData.permissions?.[resourceKey]?.[a.key]);
  };

  const actionAllSelected = (actionKey) => {
    return RESOURCES.every((r) => !!formData.permissions?.[r.key]?.[actionKey]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        permissions: formData.permissions,
      };

      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, payload);
      } else {
        await api.post('/roles', payload);
      }

      setShowModal(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      if (errors && typeof errors === 'object') {
        const lines = Object.values(errors).flat().filter(Boolean);
        alert(lines.join('\n'));
      } else if (message) {
        alert(message);
      } else {
        alert('Error saving role');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!can('roles', 'view')) {
    return (
      <div className="card">
        <div className="error-message">You do not have permission to view roles.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Roles</div>

      <div className="card">
        <div className="card-header">
          <h3>Manage Roles</h3>
          {can('roles', 'create') && (
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + Add Role
            </button>
          )}
        </div>

        <div className="search-row">
          <span>Search:</span>
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.description || 'N/A'}</td>
                  <td className="action-icons">
                    {can('roles', 'update') && (
                      <button className="icon-btn" onClick={() => handleEdit(role)} title="Edit">✏️</button>
                    )}
                    {can('roles', 'delete') && (
                      <button className="icon-btn delete" onClick={() => handleDelete(role.id)} title="Delete">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && can('roles', editingRole ? 'update' : 'create') && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 900 }}>
            <div className="modal-header">
              <h3>{editingRole ? 'Edit Role' : 'Add Role'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="table-container" style={{ marginTop: 10 }}>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <span>Permission</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => setAllPermissions(e.target.checked)}
                                title="Select all permissions"
                              />
                              <span style={{ fontSize: 12, opacity: 0.85 }}>Select all</span>
                            </label>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setAllPermissions(false)}
                              style={{ padding: '6px 10px' }}
                              title="Clear all permissions"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </th>
                      {ACTIONS.map((a) => (
                        <th key={a.key} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <span>{a.label}</span>
                            <input
                              type="checkbox"
                              checked={actionAllSelected(a.key)}
                              onChange={(e) => setActionPermissions(a.key, e.target.checked)}
                              title={`Select all ${a.label.toLowerCase()} permissions`}
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RESOURCES.map((r) => (
                      <tr key={r.key}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <span>{r.label}</span>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 12, opacity: 0.85 }}>All</span>
                              <input
                                type="checkbox"
                                checked={resourceAllSelected(r.key)}
                                onChange={(e) => setResourcePermissions(r.key, e.target.checked)}
                                title={`Select all permissions for ${r.label}`}
                              />
                            </label>
                          </div>
                        </td>
                        {ACTIONS.map((a) => (
                          <td key={a.key} style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!formData.permissions?.[r.key]?.[a.key]}
                              onChange={(e) => setPermission(r.key, a.key, e.target.checked)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRole ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
