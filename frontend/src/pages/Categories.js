import React, { useState, useEffect } from "react";
import api from "../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post("/categories", formData);
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: true,
    });
    setEditingCategory(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3>Categories Management</h3>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Category
          </button>
        </div>

        <div className="table-container">
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description || "N/A"}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          category.status ? "success" : "danger"
                        }`}
                      >
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(category)}
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="form-group switch-wrapper">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked })
                    }
                  />
                  <span className="slider round"></span>
                </label>
                <span className="switch-label">Active</span>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
