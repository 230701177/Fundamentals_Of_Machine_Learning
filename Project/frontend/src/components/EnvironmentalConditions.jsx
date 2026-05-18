import React from 'react';
import { Sun, CloudRain, ShieldAlert, Thermometer, Waves, Wind } from 'lucide-react';

const EnvironmentalConditions = ({ data }) => {
  if (!data) return null;

  const getConditionIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
      case 'hot':
        return <Sun style={{ color: '#f59e0b' }} size={20} />;
      case 'rain':
      case 'drizzle':
      case 'storm':
      case 'thunderstorm':
        return <CloudRain style={{ color: '#3b82f6' }} size={20} />;
      default:
        return <Wind style={{ color: '#94a3b8' }} size={20} />;
    }
  };

  return (
    <div className="environmental-panel">
      <h3 className="panel-title">
        <Waves size={16} /> Environmental Context
      </h3>
      
      <div className="indicators-grid">
        <div className="env-card">
          <div className="env-icon">{getConditionIcon(data.condition)}</div>
          <div className="env-info">
            <span className="env-label">Weather</span>
            <span className="env-value">{data.condition}</span>
          </div>
        </div>

        <div className="env-card">
          <div className="env-icon">
            <Thermometer style={{ color: data.temp > 35 ? '#ef4444' : '#22c55e' }} size={20} />
          </div>
          <div className="env-info">
            <span className="env-label">Temperature</span>
            <span className="env-value">{data.temp}°C</span>
          </div>
        </div>

        <div className="env-card">
          <div className="env-icon">
            <ShieldAlert style={{ color: data.floodRisk ? '#3b82f6' : '#22c55e' }} size={20} />
          </div>
          <div className="env-info">
            <span className="env-label">Flood Risk</span>
            <span className="env-value">{data.floodRisk ? 'Active' : 'Minimal'}</span>
          </div>
        </div>
      </div>

      <style>{`
        .environmental-panel {
          margin-bottom: 2rem;
        }
        .panel-title {
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.5rem;
        }
        .indicators-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .env-card {
          padding: 1.5rem;
          background: #fff;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .env-info {
          display: flex;
          flex-direction: column;
        }
        .env-label {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .env-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
        }

        @media (max-width: 640px) {
          .indicators-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default EnvironmentalConditions;
