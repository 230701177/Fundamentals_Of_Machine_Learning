import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { 
  User, Mail, Calendar, FileText, Settings, Key, LogOut, Check, X, ShieldAlert, 
  MapPin, Phone, Car, Bike, Plus, Trash2, Fuel, Briefcase, AlertTriangle
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, updateProfile: updateAuthUser, changePassword } = useAuth();
  const { profile, vehicles, updateProfile: updateProfileData, removeVehicle, addVehicle, resetAllData } = useProfile();
  const navigate = useNavigate();

  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: 'Car',
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    registration: '',
    fuelType: 'Petrol',
    color: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || ''
  });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const brands = {
    Car: ['Hyundai', 'Toyota', 'Honda', 'Suzuki', 'Tata', 'Mahindra', 'Kia', 'BMW', 'Mercedes'],
    Bike: ['Yamaha', 'Honda', 'Suzuki', 'Royal Enfield', 'KTM', 'Bajaj', 'TVS', 'Hero']
  };

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditData({
        name: user?.name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || ''
      });
    }
  }, [isEditing, user, profile]);

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (isEditing || isAddingVehicle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isEditing, isAddingVehicle]);

  const resetNewVehicle = () => {
    setNewVehicle({
      type: 'Car',
      brand: '',
      model: '',
      year: new Date().getFullYear().toString(),
      registration: '',
      fuelType: 'Petrol',
      color: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetData = () => {
    if (window.confirm("CRITICAL ACTION: This will delete ALL your registered vehicles, profile settings, and claim history. You will be sent back to the onboarding process. Proceed?")) {
      resetAllData();
      navigate('/onboarding');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAuthUser({ name: editData.name, email: editData.email });
      await updateProfileData({ 
        phone: editData.phone,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        pincode: editData.pincode
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return setMessage({ type: 'error', text: 'New passwords do not match.' });
    }
    setLoading(true);
    try {
      await changePassword(passwordData.current, passwordData.new);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  // Mock claim history data
  const claimHistory = [
    { id: 'CLM-001', type: 'Vehicle Accident', location: 'Downtown LA', amount: '$5,200', status: 'Approved' },
    { id: 'CLM-002', type: 'Property Theft', location: 'Home Address', amount: '$1,500', status: 'Review' },
    { id: 'CLM-003', type: 'Fire Damage', location: 'Office Space', amount: '$12,000', status: 'Rejected' }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'badge bg-teal text-white';
      case 'Rejected': return 'badge bg-coral text-white';
      case 'Review': return 'badge bg-mustard text-dark';
      default: return 'badge';
    }
  };

  return (
    <div className="profile-page hero-reveal">
      <div className="container">
        {message.text && (
          <div className={`status-toast ${message.type}`}>
            {message.type === 'success' ? <Check size={18} /> : <ShieldAlert size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <header className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and view claim history.</p>
        </header>

        <div className="profile-layout">
          {/* Left Panel - Profile Card */}
          <div className="profile-sidebar">
            <div className="card profile-card">
              <div className="profile-card-top-border teal-border"></div>
              <div className="avatar-placeholder">
                <User size={64} className="avatar-icon" />
              </div>
              <h2 className="profile-name">{profile?.fullName || user.name}</h2>
              <p className="profile-role">{user.role || 'SmartClaim User'}</p>

              <div className="profile-actions">
                <button 
                  className={`btn btn-secondary profile-btn ${isEditing ? 'active' : ''}`}
                  onClick={() => { setIsEditing(!isEditing); setIsChangingPassword(false); }}
                >
                  <Settings size={16} />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
                <button 
                  className={`btn btn-secondary profile-btn ${isChangingPassword ? 'active' : ''}`}
                  onClick={() => { setIsChangingPassword(!isChangingPassword); setIsEditing(false); }}
                >
                  <Key size={16} />
                  <span>{isChangingPassword ? 'Cancel Change' : 'Change Password'}</span>
                </button>
                <button className="btn profile-btn logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>

              <div className="danger-zone">
                <p className="danger-text">DANGER ZONE</p>
                <button className="btn reset-data-btn" onClick={handleResetData}>
                  <AlertTriangle size={16} />
                  <span>Delete User Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Account Details / Forms */}
          <div className="profile-content">
            {isChangingPassword ? (
              <div className="card details-card edit-panel-reveal">
                <div className="panel-header">
                  <h3 className="section-title">Security Update</h3>
                </div>
                <form onSubmit={handleChangePassword} className="profile-edit-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsChangingPassword(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card details-card">
                <div className="panel-header">
                  <h3 className="section-title">Account Details</h3>
                </div>
                
                  <div className="detail-item">
                    <div className="detail-icon"><Mail size={20} /></div>
                    <div className="detail-text">
                      <label>Email Address</label>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><Phone size={20} /></div>
                    <div className="detail-text">
                      <label>Phone Number</label>
                      <p>{profile.phone || '--'}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><MapPin size={20} /></div>
                    <div className="detail-text">
                      <label>Address</label>
                      <p>{profile.address || '--'}{profile.city ? `, ${profile.city}` : ''}{profile.pincode ? ` - ${profile.pincode}` : ''}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><Briefcase size={20} /></div>
                    <div className="detail-text">
                      <label>Registered Assets</label>
                      <p className="highlight-text">{vehicles.length}</p>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Management Section */}
        <div className="card vehicle-management-card section-margin">
          <div className="panel-header-with-action">
            <h3 className="section-title">My Registered Vehicles</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsAddingVehicle(true)}>
              <Plus size={16} /> Add Vehicle
            </button>
          </div>

          <div className="vehicles-grid-profile">
            {vehicles.map(v => (
              <div key={v.id} className="vehicle-card-item card">
                <div className="v-card-header">
                  <div className="v-type-icon">
                    {v.type === 'Car' ? <Car size={24} /> : <Bike size={24} />}
                  </div>
                  <button className="delete-v-btn" onClick={() => removeVehicle(v.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="v-card-body">
                  <h4 className="v-title">{v.brand} {v.model}</h4>
                  <p className="v-reg">{v.registration}</p>
                  <div className="v-specs">
                    <span>{v.year}</span>
                    <span className="dot">•</span>
                    <span>{v.fuelType}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {vehicles.length === 0 && (
              <div className="empty-assets">
                <ShieldAlert size={40} />
                <p>No vehicles registered. Add a vehicle to simplify your claims.</p>
              </div>
            )}
          </div>
        </div>



        {/* Claim History Table */}
        <div className="card history-card section-margin">
          <h3 className="section-title">Verified Claims Log</h3>
          <div className="table-responsive">
            <table className="retro-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Incident Type</th>
                  <th>Location</th>
                  <th>Claim Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {claimHistory.map((claim) => (
                  <tr key={claim.id}>
                    <td className="fw-bold">{claim.id}</td>
                    <td>{claim.type}</td>
                    <td>{claim.location}</td>
                    <td className="fw-bold">{claim.amount}</td>
                    <td>
                      <span className={getStatusBadgeClass(claim.status)}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card vehicle-modal"
            >
              <div className="modal-header">
                <h3>Edit Profile & Address</h3>
                <button className="close-btn" onClick={() => setIsEditing(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address (Gmail)</label>
                    <input 
                      type="email" 
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    value={editData.address}
                    placeholder="e.g. 123 Main St"
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      value={editData.city}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      value={editData.state}
                      onChange={(e) => setEditData({...editData, state: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Pincode / Zip</label>
                  <input 
                    type="text" 
                    value={editData.pincode}
                    onChange={(e) => setEditData({...editData, pincode: e.target.value})}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Add Modal (Moved to root for stable positioning) */}
      <AnimatePresence>
        {isAddingVehicle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card vehicle-modal"
            >
              <div className="modal-header">
                <h3>Register New Vehicle</h3>
                <button className="close-btn" onClick={() => setIsAddingVehicle(false)}><X size={20} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                addVehicle(newVehicle);
                setIsAddingVehicle(false);
                resetNewVehicle();
              }}>
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={newVehicle.type} 
                    onChange={e => setNewVehicle({...newVehicle, type: e.target.value, brand: '', model: ''})}
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Brand</label>
                    <select 
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands[newVehicle.type].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Creta" 
                      value={newVehicle.model}
                      required 
                      onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input 
                      type="number" 
                      value={newVehicle.year} 
                      required 
                      onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input 
                      type="text" 
                      placeholder="TN10AB1234" 
                      value={newVehicle.registration}
                      required 
                      onChange={e => setNewVehicle({...newVehicle, registration: e.target.value.toUpperCase()})} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Fuel Type</label>
                  <select 
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setIsAddingVehicle(false); resetNewVehicle(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Vehicle</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .profile-page {
          padding-top: var(--space-lg);
          padding-bottom: var(--space-xl);
        }

        .page-header {
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .page-header p {
          color: var(--text-dim);
          font-family: var(--font-body);
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        .profile-card {
          position: relative;
          text-align: center;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-card-top-border {
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

        .avatar-placeholder {
          width: 100px;
          height: 100px;
          background: var(--bg);
          border: 3px solid var(--border-bold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 4px 4px 0 var(--border-bold);
        }

        .avatar-icon {
          color: var(--primary);
        }

        .profile-name {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .profile-role {
          font-size: 0.875rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 2rem;
          background: #E0F2FE;
          color: #0369A1;
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid #0EA5E9;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
           gap: 1rem;
          width: 100%;
        }

        .profile-btn {
          width: 100%;
          justify-content: flex-start;
          padding: 12px 16px;
          border: 2px solid var(--border-bold);
          color: var(--text);
          background: var(--bg-soft);
          font-weight: 600;
        }

        .profile-btn:hover {
          background: var(--bg);
          transform: translateY(-1px);
        }

        .logout-btn {
          margin-top: 1rem;
          color: var(--danger);
          border-color: var(--border-bold);
        }

        .logout-btn:hover {
          background: #FEF2F2;
          color: #B91C1C;
        }

        .details-card {
          padding: 2.5rem;
          height: 100%;
        }

        .section-title {
          font-size: 1.25rem;
          text-transform: uppercase;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          transition: border-color 0.2s;
        }

        .detail-item:hover {
          border-color: var(--border-bold);
        }

        .detail-icon {
          background: var(--bg-soft);
          padding: 10px;
          border-radius: var(--radius-sm);
          border: 2px solid var(--border-bold);
          color: var(--text-dim);
          box-shadow: 2px 2px 0 var(--border-bold);
        }

        .detail-text label {
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          font-size: 0.75rem;
        }

        .detail-text p {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text);
        }

        .highlight-text {
          font-size: 1.25rem !important;
          color: var(--primary) !important;
          font-family: var(--font-heading);
        }

        .history-card {
          padding: 2.5rem;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .retro-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid var(--border-bold);
        }

        .retro-table th, .retro-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .retro-table th {
          background: var(--border-bold);
          color: white;
          font-family: var(--font-heading);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8125rem;
          letter-spacing: 0.05em;
          border-bottom: none;
        }

        .retro-table tr:last-child td {
          border-bottom: none;
        }

        .retro-table tbody tr {
          background: var(--bg-soft);
          transition: background 0.2s;
        }

        .retro-table tbody tr:hover {
          background: var(--bg);
        }

        .fw-bold {
          font-weight: 600;
          font-family: var(--font-heading);
        }

        .badge {
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 2px solid var(--border-bold);
          display: inline-block;
        }

        .bg-teal {
          background: var(--secondary);
          color: white;
        }

        .bg-coral {
          background: var(--danger);
          color: white;
        }

        .bg-mustard {
          background: var(--accent);
          color: var(--text);
        }

        .profile-content {
          min-height: 400px;
        }

        .edit-panel-reveal {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .status-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 1100;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          box-shadow: 4px 4px 0 var(--border-bold);
          font-weight: 700;
          font-size: 0.875rem;
          animation: toastIn 0.3s ease-out;
        }

        .status-toast.success { color: #047857; border-color: #059669; }
        .status-toast.error { color: #B91C1C; border-color: #DC2626; }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-edit-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .profile-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--border-bold);
          box-shadow: 2px 2px 0 var(--border-bold);
        }

        .panel-header-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .edit-detail-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg);
          border: 2px solid var(--border-bold);
          padding: 6px 12px;
          border-radius: 4px;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-detail-btn:hover {
          background: var(--primary);
          color: white;
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 var(--border-bold);
        }

        .vehicles-grid-profile {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .vehicle-card-item {
          padding: 1.5rem;
          border: 2px solid var(--border-bold);
          position: relative;
          transition: all 0.2s;
        }

        .vehicle-card-item:hover {
          transform: translateY(-4px);
          box-shadow: 6px 6px 0 var(--border-bold);
        }

        .v-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .v-type-icon {
          width: 48px;
          height: 48px;
          background: var(--bg);
          border: 2px solid var(--border-bold);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
        }

        .delete-v-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 5px;
        }

        .delete-v-btn:hover { color: var(--danger); }

        .danger-zone {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 2px dashed #fee2e2;
          width: 100%;
        }

        .danger-text {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--danger);
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .reset-data-btn {
          width: 100%;
          background: #fee2e2;
          color: #ef4444;
          border-color: #ef4444;
          box-shadow: 4px 4px 0 #ef4444;
        }

        .reset-data-btn:hover {
          background: #ef4444;
          color: white;
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--border-bold);
        }

        .v-title { font-size: 1.1rem; margin-bottom: 4px; color: var(--text); }
        .v-reg { font-family: var(--font-heading); font-weight: 800; font-size: 0.85rem; color: var(--primary); margin-bottom: 1rem; letter-spacing: 0.05em; }
        .v-specs { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-dim); font-weight: 600; }
        .dot { color: var(--border); }

        .empty-assets {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
        }

        /* Modal Overrides */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .vehicle-modal {
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          box-shadow: 8px 8px 0 var(--border-bold);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); }
        .modal-footer { display: flex; gap: 1rem; margin-top: 2rem; }
        .modal-footer button { flex: 1; }

        .btn-sm { padding: 8px 16px; font-size: 0.75rem; }

        .panel-header {
           margin-bottom: 0.5rem;
        }

        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
          .details-grid {
             grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .page-header {
            margin-bottom: 1.5rem;
          }
          .page-header h1 {
            font-size: 1.75rem;
          }
          .profile-card,
          .details-card,
          .history-card {
            padding: 1.25rem;
          }
          .profile-layout {
            gap: 1.25rem;
          }
          .panel-header-with-action {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .form-actions,
          .modal-footer {
            flex-direction: column;
          }
          .status-toast {
            left: 12px;
            right: 12px;
            top: 80px;
            padding: 10px 12px;
          }
          .empty-assets {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
