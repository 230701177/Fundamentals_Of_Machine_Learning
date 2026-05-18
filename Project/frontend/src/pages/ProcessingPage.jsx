import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Cpu, 
  CheckCircle2, 
  CloudRain, 
  AlertTriangle,
  Zap,
  Activity,
  Navigation
} from 'lucide-react';

const ProcessingPage = ({ claimData, prediction }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Speedometer angle: from -90 to 90 degrees (semi-circle)
  // 0% = -90deg, 100% = 90deg

  const steps = [
    { title: "Geo-Spatial Telemetry", icon: Navigation, desc: "Triangulating incident coordinates..." },
    { title: "Atmospheric Assessment", icon: CloudRain, desc: "Analyzing historical weather patterns..." },
    { title: "Structural Analysis", icon: Activity, desc: "Evaluating damage via computer vision..." },
    { title: "Risk Modeling", icon: Cpu, desc: "Running predictive fraud detection..." }
  ];

  useEffect(() => {
    // If we have an error prediction immediately, we can show it quickly or after some "loading"
    if (prediction?.status === 'error') {
      const errorTimer = setTimeout(() => {
        setShowError(true);
      }, 3000);
      return () => clearTimeout(errorTimer);
    }
  }, [prediction]);

  useEffect(() => {
    if (showError) return;

    const stepInterval = 1200;
    const totalSteps = steps.length;
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps - 1) {
          clearInterval(timer);
          setIsComplete(true);
          // Calculate final approval probability from prediction if available
          const finalProb = prediction?.data?.approval_probability 
            ? prediction.data.approval_probability * 100 
            : 85; // Default mock
          
          animateValue(progress, finalProb, 1000, setProgress);
          
          setTimeout(() => navigate('/results'), 2500);
          return prev;
        }
        return prev + 1;
      });
    }, stepInterval);

    // Continuous progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90 && !isComplete) return prev; // Stay at 90 until complete
        if (isComplete) return prev;
        return Math.min(prev + 0.5, 90);
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [navigate, isComplete, showError, prediction]);

  function animateValue(start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progressRatio = Math.min((timestamp - startTimestamp) / duration, 1);
      callback(Math.floor(progressRatio * (end - start) + start));
      if (progressRatio < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const errorContent = prediction?.message || "Location api issue : 'flowSegmentData'";

  return (
    <div className={`processing-page neo-brutal-bg ${showError ? 'error-state' : ''}`}>
      <div className="container cinematic-container">
        
        <AnimatePresence mode="wait">
          {!showError ? (
            <motion.div 
              key="main-flow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="processing-grid"
            >
              {/* Left Side: Status Column */}
              <div className="status-col">
                <div className="neo-card header-card">
                  <div className="status-badge">
                    <Zap size={14} fill="currentColor" />
                    <span>SYSTEM ACTIVE</span>
                  </div>
                  <h1>Verifying Claim</h1>
                  <p className="claim-id">ID: {claimData?.policyId || 'PENDING'}</p>
                </div>

                <div className="steps-list">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isDone = index < currentStep;
                    return (
                      <div key={index} className={`neo-step-row ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                        <div className="step-num">{index + 1}</div>
                        <div className="step-info">
                          <div className="step-title">{step.title}</div>
                          <div className="step-desc">{isActive ? step.desc : isDone ? 'Verification Complete' : 'Waiting...'}</div>
                        </div>
                        {isDone && <CheckCircle2 className="step-check" size={18} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center: The Speedometer */}
              <div className="speedometer-col">
                <div className="neo-gauge-container">
                  <div className="gauge-glass">
                    <svg viewBox="0 0 200 120" className="gauge-svg">
                      {/* Background Arc */}
                      <path 
                        d="M20,100 A80,80 0 0,1 180,100" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        className="gauge-bg-path"
                      />
                      {/* Progress Arc */}
                      <motion.path 
                        d="M20,100 A80,80 0 0,1 180,100" 
                        fill="none" 
                        stroke="var(--primary)" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        strokeDasharray="251.32"
                        strokeDashoffset={251.32 - (251.32 * (progress / 100))}
                        className="gauge-progress-path"
                      />
                      
                      {/* Ticks */}
                      {[0, 25, 50, 75, 100].map(val => {
                        const angle = (val * 1.8) - 180;
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 100 + 70 * Math.cos(rad);
                        const y1 = 100 + 70 * Math.sin(rad);
                        const x2 = 100 + 85 * Math.cos(rad);
                        const y2 = 100 + 85 * Math.sin(rad);
                        return (
                          <line 
                            key={val}
                            x1={x1} y1={y1} x2={x2} y2={y2} 
                            stroke="var(--border-bold)" 
                            strokeWidth="2" 
                          />
                        );
                      })}
                    </svg>
                    
                    <div className="gauge-center-text">
                      <div className="percentage">{Math.floor(progress)}<span className="unit">%</span></div>
                      <div className="label">{isComplete ? 'APPROVAL PROBABILITY' : 'PROCESSING...'}</div>
                    </div>
                  </div>
                </div>

                <div className="neo-card log-card">
                  <div className="log-header">
                    <Activity size={14} /> 
                    <span>TELEMETRY FEED</span>
                  </div>
                  <div className="log-content">
                    <div className="log-line"> {'>'} INITIALIZING CORE ENGINE...</div>
                    {currentStep >= 0 && <div className="log-line"> {'>'} ACCESSING GEO-TIFF LAYERS...</div>}
                    {currentStep >= 1 && <div className="log-line"> {'>'} CROSS-REFERENCING NOAA DATA...</div>}
                    {currentStep >= 2 && <div className="log-line"> {'>'} EXTRACTING PIXEL VARIANCE...</div>}
                    {currentStep >= 3 && <div className="log-line"> {'>'} RUNNING MONTE CARLO SIM...</div>}
                    {isComplete && <div className="log-line highlight"> {'>'} ANALYSIS COMPLETE. UPLOADING REPORT.</div>}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="error-flow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-container"
            >
              <div className="error-card neo-card">
                <div className="error-icon-box">
                  <AlertTriangle size={48} className="glitch-icon" />
                </div>
                <h2>System Failure</h2>
                <div className="error-terminal">
                  <div className="term-line">ERR_CODE: API_RESPONSE_MALFORMED</div>
                  <div className="term-line main-error">{errorContent}</div>
                </div>
                <p>Telemetry data stream was interrupted during analysis of segment <code>flowSegmentData</code>.</p>
                <button className="btn btn-primary" onClick={() => navigate('/submit')}>
                  RETRY SUBMISSION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .processing-page {
          min-height: 100vh;
          background: #f0f0f0;
          padding: 4rem 1rem;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .neo-brutal-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.5;
          z-index: 0;
        }

        .cinematic-container {
          position: relative;
          z-index: 1;
          max-width: 1000px !important;
        }

        .processing-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .status-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .neo-card {
          background: white;
          border: 4px solid var(--border-bold);
          box-shadow: 8px 8px 0 var(--border-bold);
          padding: 1.5rem;
          position: relative;
        }

        .header-card h1 {
          font-size: 1.75rem;
          margin: 0.5rem 0;
          line-height: 1.1;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary);
          color: white;
          padding: 4px 10px;
          font-weight: 900;
          font-size: 0.7rem;
          border: 2px solid var(--border-bold);
        }

        .claim-id {
          font-family: monospace;
          font-weight: 700;
          color: var(--text-dim);
          font-size: 0.8rem;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .neo-step-row {
          background: white;
          border: 3px solid var(--border-bold);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
          opacity: 0.6;
        }

        .neo-step-row.active {
          opacity: 1;
          background: #ffe66d; /* Yellow pop */
          transform: translateX(10px);
          box-shadow: -10px 0 0 var(--border-bold);
        }

        .neo-step-row.done {
          opacity: 1;
          background: #e5e7eb;
        }

        .step-num {
          width: 24px;
          height: 24px;
          background: var(--border-bold);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .step-info {
          flex: 1;
        }

        .step-title {
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .step-desc {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 500;
        }

        .step-check {
          color: var(--success);
        }

        /* Speedometer Styles */
        .speedometer-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .neo-gauge-container {
          background: white;
          border: 4px solid var(--border-bold);
          box-shadow: 12px 12px 0 var(--border-bold);
          aspect-ratio: 1.6 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .gauge-glass {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .gauge-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .gauge-center-text {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .percentage {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          color: var(--border-bold);
          font-family: var(--font-heading);
        }

        .percentage .unit {
          font-size: 1.5rem;
          margin-left: 2px;
        }

        .gauge-center-text .label {
          font-size: 0.7rem;
          font-weight: 900;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          margin-top: 0.5rem;
        }

        .log-card {
          padding: 0;
          overflow: hidden;
        }

        .log-header {
          background: var(--border-bold);
          color: white;
          padding: 8px 16px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .log-content {
          padding: 1rem;
          font-family: monospace;
          font-size: 0.75rem;
          height: 120px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .log-line {
          color: var(--text-dim);
        }

        .log-line.highlight {
          color: var(--primary);
          font-weight: bold;
        }

        /* Error State */
        .error-state {
          background: #ffeded;
        }

        .error-container {
          max-width: 500px;
          margin: 0 auto;
        }

        .error-card {
          border-color: var(--danger);
          box-shadow: 12px 12px 0 var(--danger);
          text-align: center;
          padding: 3rem 2rem;
        }

        .error-icon-box {
          margin-bottom: 1.5rem;
          color: var(--danger);
        }

        .error-card h2 {
          font-size: 2.5rem;
          color: var(--danger);
          margin-bottom: 1.5rem;
        }

        .error-terminal {
          background: #1a1a1a;
          color: #00ff00;
          padding: 1.5rem;
          font-family: monospace;
          text-align: left;
          border: 3px solid var(--border-bold);
          margin-bottom: 2rem;
        }

        .main-error {
          color: var(--danger);
          font-weight: bold;
          margin-top: 0.5rem;
          word-break: break-all;
        }

        .error-card p {
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--text-dim);
        }

        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }

        .glitch-icon {
          animation: glitch 0.3s infinite;
        }

        @media (max-width: 850px) {
          .processing-grid {
            grid-template-columns: 1fr;
          }
          .neo-step-row.active {
            transform: translateY(-5px);
            box-shadow: 0 10px 0 var(--border-bold);
          }
        }
      `}</style>
    </div>
  );
};

export default ProcessingPage;
