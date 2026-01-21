import React from 'react';
import { Link } from 'react-router-dom';

const Groups = () => {
  return (
    <div>
      <div className="breadcrumb">🏠 Home / Groups</div>

      <div className="card">
        <div className="card-header">
          <h3>Groups Removed</h3>
        </div>
        <div className="card-body">
          <p style={{ marginTop: 0 }}>
            Groups has been replaced by Roles.
          </p>
          <Link to="/roles" className="btn btn-primary">
            Go to Roles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Groups;
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
                  <td>{group.name}</td>
                  <td>{Array.isArray(group.permissions) ? group.permissions.join(', ') : (group.permissions || 'None')}</td>
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
