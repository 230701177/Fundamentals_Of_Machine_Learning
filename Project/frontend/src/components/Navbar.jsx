import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, LayoutDashboard, UserCircle, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar-container">
      <div className="container nav-inner">
        {/* Logo Left */}
        <Link to="/" className="nav-logo">
          <img src="/logo.jpg" alt="SmartClaim Logo" className="logo-img" />
        </Link>

        {/* Menu Items Center */}
        <div className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
            Submit Claim
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/results" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
                Analysis
              </NavLink>
            </>
          )}
        </div>

        {/* Profile Right */}
        <div className="nav-actions">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="profile-wrapper">
            <button 
              className={`profile-btn ${user ? 'active-user' : ''}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar-small">
                <User size={14} />
              </div>
              <span>{user ? (profile?.fullName || user.name).split(' ')[0] : 'Account'}</span>
              <ChevronDown size={14} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
            </button>

            {showDropdown && (
              <div className="profile-dropdown card">
                {user ? (
                  <>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{profile?.fullName || user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <UserCircle size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/results" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <Search size={16} />
                      <span>My Claims</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header">
                      <p className="dropdown-name">Welcome Guest</p>
                      <p className="dropdown-email">Sign in to save your claims</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/login" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <LogOut size={16} style={{ transform: 'rotate(180deg)' }} />
                      <span>Login</span>
                    </Link>
                    <Link to="/signup" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <UserCircle size={16} />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links container">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
            Submit Claim
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/results" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={closeMobileMenu}>
                Analysis
              </NavLink>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1100;
          background: var(--bg-soft);
          border-bottom: 2px solid var(--border-bold);
          height: 80px;
        }
        .nav-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          position: relative;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .logo-img {
          height: 56px;
          width: auto;
          object-fit: contain;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .nav-menu {
          display: flex;
          gap: 32px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-item {
          color: var(--text-dim);
          text-decoration: none;
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          position: relative;
          padding: 8px 0;
          transition: color 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-item:hover, .nav-item.active {
          color: var(--text);
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 0;
          height: 3px;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .nav-item:hover::after, .nav-item.active::after {
          width: 100%;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          position: relative;
          gap: 0.5rem;
        }
        .mobile-menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 2px solid var(--border-bold);
          background: var(--bg-soft);
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text);
        }
        .mobile-nav-panel {
          display: none;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 2px solid var(--border-bold);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          color: var(--text);
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .profile-btn:hover {
          background: var(--bg);
          transform: translateY(-1px);
        }
        .active-user {
          background: var(--bg);
          box-shadow: 2px 2px 0 var(--border-bold);
        }
        .avatar-small {
          width: 24px;
          height: 24px;
          background: var(--secondary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-bold);
        }
        .chevron {
          transition: transform 0.2s;
        }
        .chevron.rotate {
          transform: rotate(180deg);
        }
        
        .profile-wrapper {
          position: relative;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          padding: var(--space-xs);
          z-index: 1001;
          border: 2px solid var(--border-bold);
          box-shadow: 4px 4px 0 var(--border-bold);
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 8px 12px;
        }
        .dropdown-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text);
          margin-bottom: 2px;
        }
        .dropdown-email {
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          text-decoration: none;
          color: var(--text-dim);
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: var(--bg);
          color: var(--primary);
        }
        .logout-item:hover {
          color: var(--danger);
          background: #FEF2F2;
        }

        @media (max-width: 900px) {
          .nav-menu { display: none; }
          .mobile-menu-toggle { display: inline-flex; }
          .mobile-nav-panel {
            display: block;
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            background: var(--bg-soft);
            border-bottom: 2px solid var(--border-bold);
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.2s ease;
          }
          .mobile-nav-panel.open {
            max-height: 340px;
          }
          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 0;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .mobile-nav-links .nav-item {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
          }
          .mobile-nav-links .nav-item:last-child {
            border-bottom: none;
          }
          .navbar-container { height: 72px; }
          .logo-img { height: 48px; }
          .profile-btn {
            padding: 6px 10px;
            font-size: 0.6875rem;
          }
          .profile-btn span {
            max-width: 84px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .profile-dropdown {
            width: min(220px, calc(100vw - 1.5rem));
            right: -4px;
          }
        }

        @media (max-width: 640px) {
          .navbar-container { height: 68px; }
          .logo-img { height: 44px; }
          .profile-btn {
            gap: 6px;
            padding: 6px 8px;
          }
          .mobile-menu-toggle {
            width: 32px;
            height: 32px;
          }
          .profile-btn span {
            display: none;
          }
          .profile-dropdown {
            top: calc(100% + 8px);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
