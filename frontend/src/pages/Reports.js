import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6months');
  const [topProductsScope, setTopProductsScope] = useState('paid');

  const maxRevenue = Math.max(0, ...salesData.map((d) => Number(d?.revenue || 0)));
  const maxSalesCount = Math.max(0, ...salesData.map((d) => Number(d?.sales || 0)));

  const revenueAxisMax = Math.max(1, Math.ceil(maxRevenue * 1.1));
  const salesCountAxisMax = Math.max(1, Math.ceil(maxSalesCount));

  const toDateOnly = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatPeriodLabel = (p) => {
    if (!p) return '';
    // month: YYYY-MM, day: YYYY-MM-DD
    if (p.length === 7) {
      const d = new Date(`${p}-01T00:00:00`);
      return d.toLocaleString(undefined, { month: 'short' });
    }
    if (p.length === 10) {
      const d = new Date(`${p}T00:00:00`);
      return d.toLocaleString(undefined, { month: 'short', day: '2-digit' });
    }
    return p;
  };

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const start = new Date(now);

      let revenueParams = { period: 'month', limit: 6 };

      if (period === 'year') {
        start.setMonth(start.getMonth() - 11);
        start.setDate(1);
        revenueParams = {
          period: 'month',
          limit: 12,
          start_date: toDateOnly(start),
          end_date: toDateOnly(now),
        };
      } else if (period === 'month') {
        start.setDate(1);
        revenueParams = {
          period: 'day',
          limit: 31,
          start_date: toDateOnly(start),
          end_date: toDateOnly(now),
        };
      } else {
        // 6months
        start.setMonth(start.getMonth() - 5);
        start.setDate(1);
        revenueParams = {
          period: 'month',
          limit: 6,
          start_date: toDateOnly(start),
          end_date: toDateOnly(now),
        };
      }

      const [paidSalesRes, completedRevenueRes, topRes] = await Promise.all([
        api.get('/reports/revenue', { params: { ...revenueParams, scope: 'paid' } }),
        api.get('/reports/revenue', { params: { ...revenueParams, scope: 'completed' } }),
        api.get('/reports/top-products', {
          params: {
            limit: 10,
            scope: topProductsScope,
            start_date: revenueParams.start_date,
            end_date: revenueParams.end_date,
          },
        }),
      ]);

      const paidRows = Array.isArray(paidSalesRes.data) ? paidSalesRes.data : [];
      const completedRows = Array.isArray(completedRevenueRes.data) ? completedRevenueRes.data : [];

      const salesByPeriod = new Map(paidRows.map((r) => [r.period, Number(r.order_count || 0)]));
      const revenueByPeriod = new Map(completedRows.map((r) => [r.period, Number(r.total_revenue || 0)]));

      const allPeriods = Array.from(
        new Set([
          ...paidRows.map((r) => r.period),
          ...completedRows.map((r) => r.period),
        ])
      );

      allPeriods.sort();

      setSalesData(
        allPeriods.map((p) => ({
          name: formatPeriodLabel(p),
          sales: salesByPeriod.get(p) ?? 0,
          revenue: revenueByPeriod.get(p) ?? 0,
        }))
      );

      setTopProducts(Array.isArray(topRes.data) ? topRes.data : []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSalesData([]);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  }, [period, topProductsScope]); // ✅ hook deps

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]); // ✅ include callback

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="breadcrumb">🏠 Home / Reports</div>

      <div className="reports-header">
        <h3>Sales Reports</h3>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select">
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h4>Sales Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} domain={[0, salesCountAxisMax]} />
              <Tooltip formatter={(value, name) => [Number(value || 0).toLocaleString(), name]} />
              <Legend />
              <Bar dataKey="sales" fill="#4285f4" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h4>Revenue Overview</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, revenueAxisMax]} tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip formatter={(value, name) => [Number(value || 0).toLocaleString(), name]} />
              <Legend />
              <Bar dataKey="revenue" fill="#7e57c2" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h4>Orders Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} domain={[0, salesCountAxisMax]} />
              <Tooltip formatter={(value, name) => [Number(value || 0).toLocaleString(), name]} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#34a853" strokeWidth={2} name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h4 style={{ margin: 0 }}>Top Selling Products</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Scope:</span>
            <select
              value={topProductsScope}
              onChange={(e) => setTopProductsScope(e.target.value)}
              className="period-select"
              style={{ minWidth: 160 }}
            >
              <option value="paid">Paid orders</option>
              <option value="completed">Completed orders</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.units_sold}</td>
                  <td>${Number(product.revenue || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
