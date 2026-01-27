import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user');
      if (response.data) {
        const names = (response.data.name || '').split(' ');
        setProfile({
          first_name: names[0] || '',
          last_name: names.slice(1).join(' ') || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          role: response.data.role?.name || response.data.role || 'User',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user', {
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        phone: profile.phone,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      alert('New passwords do not match!');
      return;
    }
    try {
      await api.put('/user/password', passwords);
      alert('Password changed successfully!');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const getInitials = () => {
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Profile</div>
      <div className="card">
        <h3>My Profile</h3>
        
        <div className="profile-photo-section">
          <div className="profile-avatar">{getInitials()}</div>
          <div className="photo-info">
            <button className="btn btn-secondary">Change Photo</button>
            <span className="photo-hint">JPG, GIF or PNG. Max size 2MB</span>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile.email} disabled className="disabled-input" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={profile.role} disabled className="disabled-input" />
          </div>
        </form>

        <hr className="section-divider" />

        <h4>Change Password</h4>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={passwords.confirm_password} onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
