import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Tablet, Car, Bike, Plus, 
  Trash2, Edit3, ChevronRight, CheckCircle, 
  ArrowRight, ShieldCheck, Fuel, Calendar
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { profile, vehicles, updateProfile, addVehicle, removeVehicle, completeOnboarding } = useProfile();
  const { updateProfile: updateAuthUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isAddingVehicle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAddingVehicle]);

  const [newVehicle, setNewVehicle] = useState({
    type: 'Car',
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    registration: '',
    fuelType: 'Petrol',
    color: ''
  });

  const brands = {
    Car: ['Hyundai', 'Toyota', 'Honda', 'Suzuki', 'Tata', 'Mahindra', 'Kia', 'BMW', 'Mercedes'],
    Bike: ['Yamaha', 'Honda', 'Suzuki', 'Royal Enfield', 'KTM', 'Bajaj', 'TVS', 'Hero']
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    addVehicle(newVehicle);
    setIsAddingVehicle(false);
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

  const handleFinish = () => {
    completeOnboarding();
    if (profile.fullName) {
      updateAuthUser({ name: profile.fullName });
    }
    navigate('/dashboard');
  };

  const steps = [
    { id: 1, title: 'Personal Info', icon: <User size={18} /> },
    { id: 2, title: 'Add Assets', icon: <ShieldCheck size={18} /> },
    { id: 3, title: 'All Clear', icon: <CheckCircle size={18} /> }
  ];

  return (
    <div className="onboarding-page">
      <div className="container mini-container">
        {/* Progress Bar */}
        <div className="onboarding-progress">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className={`step-circle ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                {step > s.id ? <CheckCircle size={14} /> : s.icon}
                <span className="step-label">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`step-line ${step > s.id ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="onboarding-card card">
          <div className="auth-card-top-border teal-border"></div>
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="step-content"
              >
                <h2>Complete Your Profile</h2>
                <p className="step-subtitle">Provide your basic details to personalize your SmartClaim experience.</p>
                
                <form onSubmit={handleProfileSubmit} className="onboarding-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profile.fullName}
                      placeholder="Jane Doe"
                      onChange={(e) => updateProfile({ fullName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        value={profile.phone}
                        placeholder="+91 98765 43210"
                        onChange={(e) => updateProfile({ phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        value={profile.city}
                        placeholder="Mumbai"
                        onChange={(e) => updateProfile({ city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Full Address</label>
                    <textarea 
                      rows="2"
                      value={profile.address}
                      placeholder="Street, Apartment, Locality"
                      onChange={(e) => updateProfile({ address: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        value={profile.state}
                        placeholder="Maharashtra"
                        onChange={(e) => updateProfile({ state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input 
                        type="text" 
                        value={profile.pincode}
                        placeholder="400001"
                        onChange={(e) => updateProfile({ pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary next-btn">
                    Next Step <ChevronRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="step-content"
              >
                <h2>Insured Assets (Optional)</h2>
                <p className="step-subtitle">Adding your vehicle now makes claim filing faster. You can also skip this for later.</p>

                <div className="vehicle-list-onboarding">
                  {vehicles.map(v => (
                    <div key={v.id} className="vehicle-mini-card">
                      <div className="v-icon">
                        {v.type === 'Car' ? <Car size={20} /> : <Bike size={20} />}
                      </div>
                      <div className="v-info">
                        <h4>{v.brand} {v.model}</h4>
                        <p>{v.registration}</p>
                      </div>
                      <button className="remove-v" onClick={() => removeVehicle(v.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button 
                    className="add-vehicle-trigger"
                    onClick={() => setIsAddingVehicle(true)}
                  >
                    <Plus size={20} />
                    <span>Add New Vehicle</span>
                  </button>
                </div>

                <div className="onboarding-footer-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setStep(3)}
                  >
                    {vehicles.length > 0 ? 'Continue' : 'Skip for now'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="step-content success-step"
              >
                <div className="success-icon-big">
                  <CheckCircle size={80} />
                </div>
                <h2>All Set!</h2>
                <p>Your profile is complete. You can now access the SmartClaim dashboard and submit AI-assisted claims.</p>
                
                <div className="profile-summary-onboarding">
                  <div className="summary-item">
                    <span>Account:</span>
                    <strong>{profile.fullName}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Assets registered:</span>
                    <strong>{vehicles.length} Vehicles</strong>
                  </div>
                </div>

                <button className="btn btn-primary finish-btn" onClick={handleFinish}>
                  Go to Dashboard <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Vehicle Modal (Moved to root level for proper fixed positioning) */}
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
              className="card vehicle-form-modal"
            >
              <h3>Register Vehicle</h3>
              <form onSubmit={handleAddVehicle}>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <div className="type-toggle">
                    <button 
                      type="button" 
                      className={newVehicle.type === 'Car' ? 'active' : ''}
                      onClick={() => setNewVehicle({...newVehicle, type: 'Car', brand: '', model: ''})}
                    >
                      <Car size={16} /> Car
                    </button>
                    <button 
                      type="button" 
                      className={newVehicle.type === 'Bike' ? 'active' : ''}
                      onClick={() => setNewVehicle({...newVehicle, type: 'Bike', brand: '', model: ''})}
                    >
                      <Bike size={16} /> Bike
                    </button>
                  </div>
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
                      onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input 
                      type="number" 
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration No.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TN10AB1234"
                      value={newVehicle.registration}
                      onChange={(e) => setNewVehicle({...newVehicle, registration: e.target.value.toUpperCase()})}
                      required
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

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddingVehicle(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Asset</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .onboarding-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 4rem 0;
        }
        .mini-container {
          max-width: 600px !important;
        }
        
        .onboarding-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
          gap: 0;
        }
        .step-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--border);
          color: var(--text-muted);
          justify-content: center;
          transition: all 0.3s;
        }
        .step-circle.active {
          border-color: var(--secondary);
          color: var(--secondary);
          box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
        }
        .step-circle.completed {
          background: var(--secondary);
          color: white;
          border-color: var(--secondary);
        }
        .step-label {
          position: absolute;
          top: 100%;
          margin-top: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
          color: inherit;
        }
        .step-line {
          height: 2px;
          flex: 1;
          max-width: 80px;
          background: var(--border);
          margin: 0 -10px;
          margin-bottom: 20px;
        }
        .step-line.active {
          background: var(--secondary);
        }

        .onboarding-card {
           padding: 3rem;
           position: relative;
        }
        .step-content h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .step-subtitle {
          color: var(--text-dim);
          margin-bottom: 2rem;
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .next-btn {
          margin-top: 1.5rem;
          padding: 1.25rem;
          font-size: 1rem;
        }

        .vehicle-list-onboarding {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .vehicle-mini-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg);
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .v-icon {
          width: 40px;
          height: 40px;
          background: white;
          border: 1px solid var(--border-bold);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
        }
        .v-info {
          flex: 1;
        }
        .v-info h4 { font-size: 0.9rem; margin-bottom: 2px; }
        .v-info p { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-heading); font-weight: 700; }
        .remove-v {
          background: none;
          border: none;
          color: var(--danger);
          cursor: pointer;
          opacity: 0.6;
          padding: 8px;
        }
        .remove-v:hover { opacity: 1; }

        .add-vehicle-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 1.25rem;
          border: 2px dashed var(--border-bold);
          background: var(--bg-soft);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .add-vehicle-trigger:hover {
          background: var(--bg);
          border-color: var(--primary);
          color: var(--primary);
        }

        .onboarding-footer-actions {
          display: flex;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }
        .vehicle-form-modal {
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
          box-shadow: 10px 10px 0 var(--border-bold);
        }
        .type-toggle {
          display: flex;
          gap: 1rem;
        }
        .type-toggle button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid var(--border);
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .type-toggle button.active {
          border-color: var(--secondary);
          background: #F0FDFA;
          color: var(--secondary);
          box-shadow: 2px 2px 0 var(--secondary);
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .modal-actions button { flex: 1; }

        .success-step {
          text-align: center;
        }
        .success-icon-big {
          color: var(--success);
          margin-bottom: 2rem;
        }
        .profile-summary-onboarding {
          background: var(--bg);
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }
        .summary-item:last-child { border-bottom: none; }
        .finish-btn {
          width: 100%;
          padding: 1.5rem;
          font-size: 1.1rem;
        }

        @media (max-width: 900px) {
          .onboarding-page {
            padding: 2rem 0;
            align-items: flex-start;
          }
          .onboarding-card {
            padding: 2rem;
          }
          .step-content h2 {
            font-size: 1.6rem;
          }
        }

        @media (max-width: 640px) {
          .onboarding-card {
            padding: 1.25rem;
          }
          .onboarding-progress {
            margin-bottom: 1.75rem;
          }
          .step-circle {
            width: 34px;
            height: 34px;
          }
          .step-label {
            font-size: 0.625rem;
          }
          .step-line {
            max-width: 40px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .next-btn,
          .finish-btn {
            padding: 1rem;
            font-size: 0.95rem;
          }
          .onboarding-footer-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          .modal-overlay {
            padding: 0.75rem;
          }
          .vehicle-form-modal {
            padding: 1.25rem;
            box-shadow: 6px 6px 0 var(--border-bold);
          }
          .type-toggle {
            flex-direction: column;
          }
          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingPage;
