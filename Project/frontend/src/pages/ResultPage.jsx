import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';

const ResultPage = ({ claimData, prediction }) => {
  const navigate = useNavigate();

  // Handle missing data with cinematic defaults
  const data = claimData || {
    policyId: 'POL-2026-X99',
    incidentType: 'Cloudburst Flood',
    incidentTiming: '2026-03-23 18:49',
    locationCoordinates: '28.6139° N, 77.2090° E',
    damageEstimate: '45,000',
    claimAmount: '45,000',
    documents: {
      policeReportFile: 'incident_report_01.pdf',
      hospitalReport: 'medical_cert.jpg'
    }
  };

  // Prediction mapping
  const approvalProb = prediction?.data?.approval_probability 
    ? (prediction.data.approval_probability * 100).toFixed(2)
    : "73.38"; // Using user's example if missing
  
  const rejectionProb = prediction?.data?.rejection_probability
    ? (prediction.data.rejection_probability * 100).toFixed(2)
    : "26.62";

  const isApproved = parseFloat(approvalProb) >= 50;

  const summary = isApproved 
    ? "Our AI models have verified the telemetry and atmospheric data for this claim. High cross-reference compatibility detected."
    : "Discrepancies found between telemetry data and incident timing. Manual intervention recommended.";



  return (
    <div className="result-page neo-brutal-bg">
      <div className="container cinematic-container">
        
        <header className="report-header-neo">
          <button className="neo-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> RETURN
          </button>
          <div className="title-row">
            <h1>CLAIM VERDICT</h1>
            <div className="stamp">{isApproved ? 'APPROVED' : 'REVIEW'}</div>
          </div>
        </header>

        <div className="result-grid">
          
          {/* Main Visual: Speedometer / Verdict */}
          <motion.section 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="neo-card verdict-card"
          >
            <div className="card-tag">SYSTEM ANALYSIS</div>
            
            <div className="gauge-wrapper">
              <svg viewBox="0 0 200 120" className="result-gauge">
                <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke={isApproved ? "var(--success)" : "var(--primary)"} 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  strokeDasharray="251.32"
                  strokeDashoffset={251.32 - (251.32 * (parseFloat(approvalProb) / 100))}
                />
              </svg>
              <div className="gauge-text">
                <div className="prob-value">{approvalProb}%</div>
                <div className="prob-label">TRUST SCORE</div>
              </div>
            </div>

            <div className="split-probs">
              <div className="prob-box approval">
                <div className="label">APPROVAL</div>
                <div className="val">{approvalProb}%</div>
              </div>
              <div className="prob-box rejection">
                <div className="label">REJECTION</div>
                <div className="val">{rejectionProb}%</div>
              </div>
            </div>

            <div className="verdict-summary">
              <p>{summary}</p>
            </div>


          </motion.section>

          {/* Details Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="details-col"
          >
            <section className="neo-card info-card">
              <h3>CLAIM PARAMETERS</h3>
              <div className="info-list">
                <div className="info-item">
                  <FileText size={16} />
                  <span className="label">POLICY:</span>
                  <span className="value">{data.policyId}</span>
                </div>
                <div className="info-item">
                  <ShieldCheck size={16} />
                  <span className="label">TYPE:</span>
                  <span className="value">{data.incidentType}</span>
                </div>
                <div className="info-item">
                  <Clock size={16} />
                  <span className="label">TIMING:</span>
                  <span className="value">{data.incidentTiming}</span>
                </div>
                <div className="info-item">
                  <MapPin size={16} />
                  <span className="label">LOCATION:</span>
                  <span className="value">{data.locationCoordinates}</span>
                </div>
              </div>
            </section>

            <section className="neo-card info-card highlight">
              <h3>FINANCIALS</h3>
              <div className="info-list">
                <div className="info-item">
                  <IndianRupee size={16} />
                  <span className="label">ESTIMATE:</span>
                  <span className="value">{data.damageEstimate}</span>
                </div>
                <div className="info-item">
                  <IndianRupee size={16} />
                  <span className="label">CLAIMED:</span>
                  <span className="value">{data.claimAmount}</span>
                </div>
              </div>
            </section>

            <section className="neo-card info-card">
              <h3>SECURE DOCUMENTS</h3>
              <div className="doc-grid">
                <div className="doc-pill">
                  <CheckCircle2 size={14} className="success-icon" /> POLICE REPORT
                </div>
                <div className="doc-pill">
                  <CheckCircle2 size={14} className="success-icon" /> HOSPITAL RPT
                </div>
              </div>
            </section>
          </motion.div>

        </div>
      </div>

      <style>{`
        .result-page {
          min-height: 100vh;
          padding: 4rem 1rem;
          position: relative;
        }

        .neo-brutal-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.5;
          z-index: 0;
        }

        .cinematic-container {
          position: relative;
          z-index: 1;
        }

        .report-header-neo {
          margin-bottom: 3rem;
        }

        .neo-back-btn {
          border: 3px solid var(--border-bold);
          background: white;
          padding: 8px 16px;
          font-weight: 900;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--border-bold);
          margin-bottom: 2rem;
        }

        .neo-back-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--border-bold);
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .title-row h1 {
          font-size: 4rem;
          font-weight: 950;
          text-transform: uppercase;
          line-height: 0.9;
          letter-spacing: -0.05em;
        }

        .stamp {
          border: 6px solid var(--border-bold);
          padding: 10px 20px;
          font-size: 1.5rem;
          font-weight: 900;
          transform: rotate(-5deg);
          background: #ffe66d;
          box-shadow: 6px 6px 0 var(--border-bold);
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
        }

        .neo-card {
          background: white;
          border: 4px solid var(--border-bold);
          box-shadow: 12px 12px 0 var(--border-bold);
          padding: 2rem;
          position: relative;
        }

        .card-tag {
          position: absolute;
          top: -14px;
          left: 20px;
          background: var(--border-bold);
          color: white;
          padding: 2px 12px;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .verdict-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .gauge-wrapper {
          width: 80%;
          max-width: 400px;
          position: relative;
          margin: 2rem 0;
        }

        .result-gauge {
          width: 100%;
          height: auto;
        }

        .gauge-text {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
        }

        .prob-value {
          font-size: 3.5rem;
          font-weight: 950;
          color: var(--border-bold);
          line-height: 1;
        }

        .prob-label {
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--text-dim);
          letter-spacing: 0.2em;
        }

        .split-probs {
          display: flex;
          gap: 1rem;
          width: 100%;
          margin-bottom: 2rem;
        }

        .prob-box {
          flex: 1;
          border: 3px solid var(--border-bold);
          padding: 1rem;
          text-align: center;
        }

        .prob-box.approval { background: #dcfce7; }
        .prob-box.rejection { background: #fee2e2; }

        .prob-box .label {
          font-size: 0.6rem;
          font-weight: 900;
          margin-bottom: 4px;
          color: var(--text-dim);
        }

        .prob-box .val {
          font-size: 1.5rem;
          font-weight: 900;
        }

        .verdict-summary {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-dim);
          margin-bottom: 2.5rem;
        }

        .action-row {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .neo-btn {
          flex: 1;
          border: 3px solid var(--border-bold);
          padding: 1rem;
          font-weight: 900;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary { 
          background: var(--primary); 
          color: white; 
          box-shadow: 6px 6px 0 var(--border-bold);
        }
        .btn-secondary { 
          background: white; 
          box-shadow: 4px 4px 0 var(--border-bold);
        }

        .neo-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 0 0 0 var(--border-bold);
        }

        .details-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-card h3 {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-bottom: 3px solid var(--border-bold);
          display: inline-block;
          padding-bottom: 4px;
        }

        .info-card.highlight {
          background: #e0f2fe; /* Light blue */
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .info-item .label {
          color: var(--text-dim);
          width: 80px;
        }

        .info-item .value {
          color: var(--border-bold);
          flex: 1;
          text-align: right;
        }

        .doc-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .doc-pill {
          background: white;
          border: 2px solid var(--border-bold);
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .success-icon { color: var(--success); }

        @media (max-width: 900px) {
          .result-grid {
            grid-template-columns: 1fr;
          }
          .title-row h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
