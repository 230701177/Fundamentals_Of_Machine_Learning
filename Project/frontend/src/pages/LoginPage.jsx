import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Let the login message show briefly before redirecting
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container hero-reveal">
      <div className="auth-header">
        <p className="auth-tagline">Secure access to intuitive AI verification</p>
      </div>

      <div className="auth-card card">
        <div className="auth-card-top-border"></div>
        <h2>Welcome Back</h2>
        <p className="auth-subtext">Login to access your claims and dashboard</p>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading && !error && (
          <div className="auth-alert success">
            <CheckCircle size={18} />
            <span>Authenticating...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: calc(100vh - 160px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl) var(--space-md);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-lg);
        }

        .auth-logo img {
          height: 64px;
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
        }

        .auth-tagline {
          color: var(--text-dim);
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          padding: var(--space-lg);
          border: 2px solid var(--border-bold);
          background: var(--bg-soft);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 0 rgba(0,0,0,0.05);
        }

        .auth-card-top-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          height: 6px;
          background: var(--primary);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          border: 2px solid var(--border-bold);
          border-bottom: none;
        }

        .auth-card h2 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
          text-align: center;
        }

        .auth-subtext {
          color: var(--text-dim);
          text-align: center;
          margin-bottom: var(--space-lg);
          font-size: 0.875rem;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
          font-size: 0.875rem;
          font-weight: 500;
          border: 2px solid;
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #B91C1C;
          border-color: #F87171;
        }

        .auth-alert.success {
          background: rgba(16, 185, 129, 0.1);
          color: #047857;
          border-color: #34D399;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 1rem;
          transition: all 0.2s;
          background: var(--bg);
        }

        .auth-input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--bg-soft);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .password-toggle:hover {
          color: var(--text);
        }

        .forgot-password {
          text-align: right;
          margin-top: 8px;
        }

        .forgot-password link, .forgot-password a {
          color: var(--text-dim);
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-password link:hover, .forgot-password a:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .auth-btn {
          margin-top: var(--space-sm);
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          border: 2px solid var(--border-bold);
          box-shadow: 4px 4px 0 var(--border-bold);
          transition: all 0.2s;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--border-bold);
        }
        
        .auth-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0 var(--border-bold);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-dim);
        }

        .auth-footer a {
          color: var(--secondary);
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .auth-container {
            min-height: calc(100vh - 120px);
            padding: var(--space-lg) 0.875rem;
          }
          .auth-card {
            padding: 1.25rem;
          }
          .auth-card h2 {
            font-size: 1.5rem;
          }
          .auth-btn {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
