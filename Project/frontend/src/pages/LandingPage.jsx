import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Search, ArrowRight, BarChart3, Globe, Cpu, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Decorative Shapes */}
      <div className="retro-shape shape-1"></div>
      <div className="retro-shape shape-2"></div>
      <div className="retro-shape shape-3"></div>

      {/* Hero Section */}
      <section className="hero-section hero-reveal">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="hero-title">
                SmartClaim AI
              </h1>
              <p className="hero-subtitle">
                Stress-free insurance claim verification. No account required. 
                Experience intelligent verification protocols in seconds.
              </p>
              <div className="hero-actions">
                <Link to="/submit" className="btn btn-primary">
                  Submit Direct Claim <ArrowRight size={18} />
                </Link>
                <Link to="/dashboard" className="btn btn-secondary">
                  Login for Profile
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section-margin">
        <div className="container">
          <div className="features-grid">
            <div className="card feature-card border-orange">
              <div className="feature-icon-box"><Globe size={32} /></div>
              <h3>AI Verification</h3>
              <p>Advanced location verification mapping coordinates against historical regional risk data models.</p>
            </div>
            
            <div className="card feature-card border-teal">
              <div className="feature-icon-box"><Zap size={32} /></div>
              <h3>Climate Check</h3>
              <p>Cross-referencing reported incidents with localized weather patterns at the precise time of claim.</p>
            </div>
            
            <div className="card feature-card border-teal">
              <div className="feature-icon-box"><Shield size={32} /></div>
              <h3>Fraud Detection</h3>
              <p>Automated pattern assessment flagging inconsistencies before manual intervention is required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section section-margin">
        <div className="container">
          <div className="card workflow-card">
            <h2 className="workflow-title">Verification Workflow</h2>
            
            <div className="workflow-steps">
              <div className="step-item">
                <div className="step-count">01</div>
                <div className="step-icon"><Cpu size={24} /></div>
                <h4>Input Data</h4>
              </div>
              <div className="workflow-divider"></div>
              <div className="step-item">
                <div className="step-count">02</div>
                <div className="step-icon"><Search size={24} /></div>
                <h4>Context Analysis</h4>
              </div>
              <div className="workflow-divider"></div>
              <div className="step-item active">
                <div className="step-count">03</div>
                <div className="step-icon"><CheckCircle size={24} /></div>
                <h4>Final Verdict</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bottom-spacing" style={{ height: '80px' }}></div>

      <style>{`
        .landing-page {
          overflow-x: hidden;
          position: relative;
        }
        
        /* Retro Decorative Shapes */
        .retro-shape {
          position: absolute;
          z-index: -1;
          opacity: 0.1;
        }
        .shape-1 {
          width: 300px;
          height: 300px;
          background: var(--primary);
          border-radius: 50%;
          top: -100px;
          right: -100px;
        }
        .shape-2 {
          width: 200px;
          height: 200px;
          background: var(--secondary);
          top: 40%;
          left: -100px;
          transform: rotate(45deg);
        }
        .shape-3 {
          width: 150px;
          height: 150px;
          background: var(--accent);
          border-radius: 20px;
          bottom: 10%;
          right: 5%;
        }

        .hero-section {
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hero-title {
          font-size: 5rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-family: var(--font-body);
          font-size: 1.25rem;
          color: var(--text-dim);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .feature-card.border-orange { border: 2px solid var(--primary); }
        .feature-card.border-teal { border: 2px solid var(--secondary); }
        
        .feature-icon-box {
          color: var(--text);
          margin-bottom: 2rem;
        }
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }
        .feature-card p {
          color: var(--text-dim);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .workflow-card {
          padding: 4rem;
          border: 2px solid var(--border-bold);
        }
        .workflow-title {
          text-align: center;
          margin-bottom: 4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .workflow-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          position: relative;
        }
        .step-count {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--primary);
        }
        .step-icon {
          width: 64px;
          height: 64px;
          background: #fff;
          border: 2px solid var(--border-bold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          border-radius: 4px;
        }
        .step-item.active .step-icon {
          background: var(--secondary);
          color: #fff;
          border-color: var(--secondary);
        }
        .step-item h4 {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .workflow-divider {
          flex: 1;
          height: 2px;
          background: var(--border-bold);
          margin: 0 20px;
          margin-top: 15px;
        }

        @media (max-width: 1024px) {
          .hero-title { font-size: 3.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .workflow-steps { flex-direction: column; gap: 3rem; }
          .workflow-divider { width: 2px; height: 40px; margin: 0; }
        }

        @media (max-width: 640px) {
          .hero-section {
            min-height: 68vh;
            height: auto;
            padding: 2rem 0;
          }
          .hero-title {
            font-size: 2.25rem;
            line-height: 1.1;
          }
          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1.75rem;
          }
          .hero-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          .feature-card {
            padding: 1.5rem 1.25rem;
          }
          .workflow-card {
            padding: 1.5rem 1rem;
          }
          .workflow-title {
            margin-bottom: 2rem;
          }
          .retro-shape {
            opacity: 0.06;
          }
          .bottom-spacing {
            height: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
