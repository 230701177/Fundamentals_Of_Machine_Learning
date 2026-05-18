import React from 'react';
import { Flame, AlertTriangle, ThermometerSun, ShieldAlert } from 'lucide-react';

const VehicleDamageContext = ({ weatherData, incidentType }) => {
  if (!weatherData || (incidentType !== 'Fire' && incidentType !== 'Other')) return null;

  const isHighRisk = weatherData.temp > 35;
  
  return (
    <div className="vehicle-analysis-reveal animate-in">
      <h3 className="section-title">
        <ShieldAlert size={18} /> Deep Damage Context
      </h3>
      
      <div className="analysis-box">
        <header className="analysis-header" style={{ backgroundColor: isHighRisk ? 'var(--danger)' : 'var(--primary)' }}>
          <AlertTriangle size={16} />
          <span>Thermal Analysis Verification</span>
        </header>
        
        <div className="analysis-content">
          <div className="insight-grid">
            <div className="insight-item">
              <ThermometerSun size={20} className="insight-icon" />
              <div className="insight-text">
                <h6>Verified Ambient Temperature</h6>
                <p>The sensor record indicates {weatherData.temp}°C at the time of incident.</p>
              </div>
            </div>
            
            <div className="insight-item">
              <Flame size={20} className="insight-icon" />
              <div className="insight-text">
                <h6>Environmental Heat Index</h6>
                <p>Conditions are classified as {weatherData.heatIndex}, supporting potential thermal stress.</p>
              </div>
            </div>
          </div>

          <div className="summary-note">
            <p><strong>AI Contextual Note:</strong> {isHighRisk 
              ? `Extreme heat detected. Local conditions strongly support the possibility of temperature-induced vehicle failures or ignition.` 
              : `Thermal data recorded. Ambient conditions are within moderate limits but remain under verification for claim legitimacy.`}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .vehicle-analysis-reveal {
          margin-top: 2rem;
        }
        .analysis-box {
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: white;
        }
        .analysis-header {
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .analysis-content {
          padding: 1.5rem;
        }
        .insight-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .insight-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .insight-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .insight-text h6 {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 4px;
          text-transform: uppercase;
          color: var(--text);
        }
        .insight-text p {
          font-size: 0.8125rem;
          margin: 0;
          color: var(--text-dim);
          line-height: 1.5;
        }
        .summary-note {
          background: #FEF3C7;
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          border: 2px solid #F59E0B;
        }
        .summary-note p {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #92400E;
          margin: 0;
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .insight-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default VehicleDamageContext;
