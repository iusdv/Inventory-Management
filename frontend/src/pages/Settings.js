import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const STORAGE_KEY = 'inventory_settings_v1';

const ToggleRow = ({ title, description, checked, onChange }) => {
  return (
    <div className="settings-row">
      <div className="settings-row-left">
        <div className="settings-label">{title}</div>
        <div className="settings-desc">{description}</div>
      </div>
      <label className="switch" aria-label={title}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="slider" />
      </label>
    </div>
  );
};

const SelectRow = ({ label, value, onChange, options }) => {
  return (
    <div className="settings-select-row">
      <div className="settings-label">{label}</div>
      <select className="settings-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

const Settings = () => {
  const defaults = useMemo(
    () => ({
      emailNotifications: true,
      lowStockAlerts: true,
      orderNotifications: true,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'ET',
      autoUpdateStock: true,
      showOutOfStockItems: false,
    }),
    []
  );

  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage(null);
      let loadedFromApi = false;
      try {
        const res = await api.get('/settings');
        if (res?.data) {
          setSettings({ ...defaults, ...res.data });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaults, ...res.data }));
          } catch {
            // ignore storage errors
          }
          loadedFromApi = true;
        }
      } catch {
        // fall back to local storage
      }

      if (!loadedFromApi) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            setSettings({ ...defaults, ...JSON.parse(raw) });
          } else {
            setSettings(defaults);
          }
        } catch {
          setSettings(defaults);
        }
      }

      setLoading(false);
    };

    load();
  }, [defaults]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch {
      setMessage({ type: 'success', text: 'Saved locally (API not available).' });
    } finally {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // ignore
      }
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Settings</div>
      <div className="card settings-card">
        <h3>System Settings</h3>

        {message?.type === 'success' && <div className="success-message">{message.text}</div>}
        {message?.type === 'error' && <div className="error-message">{message.text}</div>}

        <div className="settings-section">
          <div className="settings-section-title">General Settings</div>

          <ToggleRow
            title="Email Notifications"
            description="Receive email updates for orders and inventory"
            checked={settings.emailNotifications}
            onChange={(v) => update('emailNotifications', v)}
          />

          <ToggleRow
            title="Low Stock Alerts"
            description="Get notified when products are low in stock"
            checked={settings.lowStockAlerts}
            onChange={(v) => update('lowStockAlerts', v)}
          />

          <ToggleRow
            title="Order Notifications"
            description="Receive notifications for new orders"
            checked={settings.orderNotifications}
            onChange={(v) => update('orderNotifications', v)}
          />
        </div>

        <div className="settings-divider" />

        <div className="settings-section">
          <div className="settings-section-title">Display Settings</div>

          <SelectRow
            label="Currency"
            value={settings.currency}
            onChange={(v) => update('currency', v)}
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - British Pound' },
            ]}
          />

          <SelectRow
            label="Date Format"
            value={settings.dateFormat}
            onChange={(v) => update('dateFormat', v)}
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
          />

          <SelectRow
            label="Timezone"
            value={settings.timezone}
            onChange={(v) => update('timezone', v)}
            options={[
              { value: 'ET', label: 'Eastern Time (ET)' },
              { value: 'CT', label: 'Central Time (CT)' },
              { value: 'MT', label: 'Mountain Time (MT)' },
              { value: 'PT', label: 'Pacific Time (PT)' },
            ]}
          />
        </div>

        <div className="settings-divider" />

        <div className="settings-section">
          <div className="settings-section-title">Inventory Settings</div>

          <ToggleRow
            title="Auto-update Stock"
            description="Automatically update stock levels after orders"
            checked={settings.autoUpdateStock}
            onChange={(v) => update('autoUpdateStock', v)}
          />

          <ToggleRow
            title="Show Out of Stock Items"
            description="Display products that are out of stock"
            checked={settings.showOutOfStockItems}
            onChange={(v) => update('showOutOfStockItems', v)}
          />
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
