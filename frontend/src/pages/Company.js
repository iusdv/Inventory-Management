import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Company = () => {
  const [company, setCompany] = useState({
    name: '',
    tax_id: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    phone: '',
    email: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await api.get('/company');
      if (response.data) {
        setCompany(response.data);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: company.name,
        tax_id: company.tax_id || null,
        address: company.address || null,
        city: company.city || null,
        zip: company.zip || null,
        country: company.country || null,
        phone: company.phone || null,
        email: company.email || null,
        website: company.website || null,
        logo: company.logo || null,
      };

      if (company.id) {
        await api.put(`/company/${company.id}`, payload);
      } else {
        await api.post('/company', payload);
      }
      alert('Company information saved successfully!');
    } catch (error) {
      console.error('Error saving company:', error);
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
        alert('Error saving company information');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Company</div>
      <div className="card">
        <h3>Company Information</h3>
        <form onSubmit={handleSubmit} className="company-form">
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value={company.name || ''} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tax ID</label>
              <input type="text" value={company.tax_id || ''} onChange={(e) => setCompany({ ...company, tax_id: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={company.address || ''} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" value={company.city || ''} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Zip</label>
              <input type="text" value={company.zip || ''} onChange={(e) => setCompany({ ...company, zip: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={company.country || ''} onChange={(e) => setCompany({ ...company, country: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={company.phone || ''} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={company.email || ''} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="text" value={company.website || ''} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Company;
