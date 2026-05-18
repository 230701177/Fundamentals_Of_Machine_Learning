import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!password) {
      setStrength('');
    } else if (password.length < 6) {
      setStrength('Weak');
    } else if (password.length < 10) {
      setStrength('Medium');
    } else {
      setStrength('Strong');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to create an account');
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Weak': return 'var(--danger)';
      case 'Medium': return 'var(--accent)';
      case 'Strong': return 'var(--success)';
      default: return 'var(--border)';
    }
  };

  return (
    <div className="auth-container hero-reveal">
      <div className="auth-card card signup-card">
        <div className="auth-card-top-border teal-border"></div>
        <div className="card-header-icon">
          <ShieldCheck size={36} color="var(--secondary)" />
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtext">Join SmartClaim for intelligent verification</p>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
          </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: strength === 'Weak' ? '33%' : strength === 'Medium' ? '66%' : '100%',
                      background: getStrengthColor()
                    }}
                  ></div>
                </div>
                <span style={{ color: getStrengthColor(), fontWeight: 600 }}>{strength}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
        </div>
      </div>

      <style>{`
        /* Inheriting auth container styles from LoginPage if possible, but adding specific here */
        .auth-container {
          min-height: calc(100vh - 160px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl) var(--space-md);
        }

        .signup-card {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
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
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          border: 2px solid var(--border-bold);
          border-bottom: none;
        }

        .teal-border {
          background: var(--secondary);
        }

        .card-header-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .signup-card h2 {
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
          border-color: var(--secondary);
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

        .password-strength {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 0.75rem;
        }

        .strength-bar-container {
          flex: 1;
          height: 6px;
          background: var(--border);
          border-radius: 3px;
          margin-right: 12px;
          overflow: hidden;
        }

        .strength-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .auth-btn {
          margin-top: var(--space-sm);
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          border: 2px solid var(--border-bold);
          transition: all 0.2s;
        }

        .signup-btn {
          background: var(--secondary);
          color: white;
          box-shadow: 4px 4px 0 var(--border-bold);
        }

        .signup-btn:hover:not(:disabled) {
          background: #0D9488;
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--border-bold);
        }
        
        .signup-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0 var(--border-bold);
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

        .auth-footer {
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-dim);
        }

        .login-link {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .auth-container {
            min-height: calc(100vh - 120px);
            padding: var(--space-lg) 0.875rem;
          }
          .signup-card {
            padding: 1.25rem;
          }
          .signup-card h2 {
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

export default SignupPage;
