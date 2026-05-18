import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="retro-footer">
      <div className="container">
        <div className="footer-content">
          <h2 className="footer-logo">SmartClaim AI</h2>
          
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/submit">Submit Claim</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-info">
            <p>&copy; 2026 Team Project</p>
          </div>
        </div>
      </div>

      <style>{`
        .retro-footer {
          padding: var(--space-xl) 0;
          background: #F3F4F6;
          border-top: 2px solid var(--border);
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          text-align: center;
        }
        .footer-logo {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--text);
          text-transform: uppercase;
        }
        .footer-links {
          display: flex;
          gap: var(--space-lg);
          flex-wrap: wrap;
          justify-content: center;
        }
        .footer-links a {
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-dim);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }
        .footer-links a:hover {
          color: var(--primary);
        }
        .footer-info p {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        @media (max-width: 640px) {
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
