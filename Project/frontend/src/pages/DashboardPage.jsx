import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, CheckCircle, XCircle, AlertCircle, Files, Activity, Download, List, Car
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

const DashboardPage = () => {
  const { vehicles } = useProfile();
  // Retro palette for charts
  const statusData = [
    { name: 'Approved', value: 450, color: '#14B8A6' }, // Retro Teal
    { name: 'Rejected', value: 120, color: '#EF4444' }, // Coral Red
    { name: 'Review', value: 85, color: '#EAB308' },   // Mustard Yellow
  ];

  const volumeData = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 48 },
    { month: 'Apr', count: 61 },
    { month: 'May', count: 55 },
    { month: 'Jun', count: 67 },
  ];

  const recentActivity = [
    { id: 'CLM-7281', amount: 4500, type: 'Accident', score: 92, status: 'Approved' },
    { id: 'CLM-7282', amount: 12000, type: 'Theft', score: 15, status: 'Rejected' },
    { id: 'CLM-7283', amount: 3200, type: 'Fire', score: 55, status: 'Review' },
    { id: 'CLM-7284', amount: 1500, type: 'Accident', score: 98, status: 'Approved' },
    { id: 'CLM-7285', amount: 8000, type: 'Other', score: 78, status: 'Approved' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="card stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-header">
        <div className="stat-icon" style={{ color: color }}><Icon size={20} /></div>
        <div className={`trend ${trend > 0 ? 'up' : 'down'}`}>
           {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      </div>
      <div className="stat-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page hero-reveal">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Verification metrics and throughput analysis.</p>
          </div>
          <button className="btn btn-secondary">
            <Download size={16} /> Export Dataset
          </button>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard title="Total Claims" value="1,284" icon={Files} trend={12} color="#F97316" />
          <StatCard title="Registered Assets" value={vehicles.length} icon={Car} trend={0} color="#14B8A6" />
          <StatCard title="Approved Claims" value="1,024" icon={CheckCircle} trend={2} color="#10B981" />
          <StatCard title="In Review" value="45" icon={AlertCircle} trend={8} color="#EAB308" />
        </div>

        {/* Charts Section */}
        <div className="charts-grid section-margin">
          <div className="card chart-card">
            <div className="chart-header">
              <Activity size={18} />
              <h3>Status Distribution</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ border: '2px solid var(--border-bold)', borderRadius: '4px', fontFamily: 'var(--font-heading)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontFamily: 'var(--font-heading)', fontSize: '11px', textTransform: 'uppercase' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <TrendingUp size={18} />
              <h3>Monthly Velocity</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 600 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ border: '2px solid var(--border-bold)', borderRadius: '4px', fontFamily: 'var(--font-heading)' }}
                  />
                  <Bar dataKey="count" fill="#F97316" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card activity-card section-margin">
          <div className="activity-header">
            <List size={20} />
            <h3>Verified Claims Log</h3>
          </div>
          <div className="table-overflow">
            <table className="retro-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Amount</th>
                  <th>Classification</th>
                  <th>Confidence</th>
                  <th className="text-right">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((claim) => (
                  <tr key={claim.id}>
                    <td className="id-cell">{claim.id}</td>
                    <td>${claim.amount.toLocaleString()}</td>
                    <td>{claim.type}</td>
                    <td>
                      <div className="confidence-retro">
                        <div className="track-retro">
                          <div className="fill-retro" style={{ 
                            width: `${claim.score}%`,
                            background: claim.score > 80 ? 'var(--secondary)' : claim.score > 40 ? 'var(--accent)' : 'var(--danger)'
                          }} />
                        </div>
                        <span className="val-retro">{claim.score}%</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className={`badge ${
                        claim.status === 'Approved' ? 'badge-success' : 
                        claim.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          padding-top: var(--space-lg);
          padding-bottom: var(--space-xl);
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
          margin-top: 1rem;
        }
        .dashboard-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .dashboard-header p {
          color: var(--text-dim);
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .stat-card {
          padding: 2rem;
          border: 2px solid var(--border);
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .trend {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .trend.up { color: var(--secondary); }
        .trend.down { color: var(--danger); }
        
        .stat-value {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .stat-label {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        .chart-card {
          padding: 2.5rem;
          border: 2px solid var(--border);
        }
        .chart-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2.5rem;
          color: var(--text);
        }
        .chart-header h3 {
          font-size: 1rem;
          text-transform: uppercase;
          font-weight: 700;
        }

        .activity-card {
          padding: 0;
          overflow: hidden;
          border: 2px solid var(--border-bold);
        }
        .activity-header {
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 2px solid var(--border-bold);
          background: #F3F4F6;
        }
        .activity-header h3 {
          font-size: 1rem;
          color: var(--text);
          text-transform: uppercase;
        }
        .table-overflow {
          background: white;
        }
        .retro-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .retro-table th {
          padding: 1.25rem 2rem;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          border-bottom: 2px solid var(--border);
        }
        .retro-table td {
          padding: 1.25rem 2rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
          font-weight: 500;
        }
        .id-cell {
          font-weight: 800;
          color: var(--primary);
        }
        .confidence-retro {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .track-retro {
          flex: 1;
          height: 6px;
          background: #F3F4F6;
          border-radius: 3px;
          max-width: 120px;
          border: 1px solid var(--border);
        }
        .fill-retro {
          height: 100%;
          border-radius: 3px;
        }
        .val-retro {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          color: var(--text);
          font-weight: 700;
        }
        .text-right { text-align: right; }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .dashboard-header h1 { font-size: 2rem; }
          .dashboard-header { margin-bottom: 2rem; }
          .stat-card { padding: 1.25rem; }
          .chart-card { padding: 1.25rem; }
          .activity-header { padding: 1rem 1rem; }
          .retro-table th,
          .retro-table td {
            padding: 0.875rem 1rem;
            white-space: nowrap;
          }
          .table-overflow {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
