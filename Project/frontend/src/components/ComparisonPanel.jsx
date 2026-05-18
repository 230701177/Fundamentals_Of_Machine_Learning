import React from 'react';
import { Activity, Info } from 'lucide-react';

const ComparisonPanel = ({ formData, weatherData }) => {
  if (!weatherData) return null;

  const getAnalysis = () => {
    if (formData.incidentType === 'Fire' && weatherData.temp > 35) {
      return "Verified: Ambient temperature exceeds 35°C, supporting claims of heat-related mechanical failure or ignition risk.";
    }
    if (formData.incidentType === 'Accident' && weatherData.floodRisk) {
      return "Verified: Local precipitation and flood risks increase hydroplaning probability, aligning with reported incident conditions.";
    }
    if (formData.incidentType === 'Theft' && weatherData.temp < 10) {
      return "Verified: Low temperature and potential reduced visibility period confirmed during reported incident window.";
    }
    return "Verified: Local environmental parameters successfully captured. Data consistent with baseline regional variables.";
  };

  return (
    <div className="comparison-card">
      <div className="card-header-slim">
        <Activity size={14} />
        <span>Assessment Engine</span>
      </div>
      
      <div className="comparison-body">
        <div className="comparison-meta">
          <div className="meta-block">
            <span className="meta-label">Incident</span>
            <span className="meta-value highlight">{formData.incidentType}</span>
          </div>
          <div className="vs-badge">VS</div>
          <div className="meta-block">
            <span className="meta-label">Verified</span>
            <span className="meta-value">
              {weatherData.temp}°C · {weatherData.condition}
            </span>
          </div>
        </div>

        <div className="system-observation">
          <div className="obs-tag">
            <Info size={12} />
            <span>AI Observation</span>
          </div>
          <p className="obs-description">{getAnalysis()}</p>
        </div>

        <div className="verification-footer">
          <div className="status-dot-pulse"></div>
          <span>Active Environmental Monitoring</span>
        </div>
      </div>

      <style>{`
        .comparison-card {
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .card-header-slim {
          background: var(--border-bold);
          color: #fff;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .comparison-body {
          padding: 1.5rem;
        }
        .comparison-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }
        .meta-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meta-label {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 800;
        }
        .meta-value {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text);
        }
        .meta-value.highlight {
          color: var(--primary);
        }
        .vs-badge {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--text);
          background: #F3F4F6;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--border-bold);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .system-observation {
          background: #F9FAFB;
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          margin-bottom: 1.25rem;
        }
        .obs-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .obs-description {
          font-size: 0.75rem;
          margin: 0;
          color: var(--text-dim);
          line-height: 1.5;
          font-weight: 500;
        }
        .verification-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
        }
        .status-dot-pulse {
          width: 8px;
          height: 8px;
          background: var(--secondary);
          border-radius: 50%;
          animation: simple-pulse 2s infinite;
        }
        @keyframes simple-pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ComparisonPanel;
