import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MapSelector from '../components/MapSelector';
import DatePicker from '../components/DatePicker';
import TimePicker from '../components/TimePicker';
import { 
  FileText, Upload, 
  IndianRupee, Activity, AlertCircle
} from 'lucide-react';

const incidentTypes = [
  "Flood",
  "Fire",
  "Vehicle Failure",
  "Vandalism",
  "Theft",
  "Accident"
];

const SubmissionPage = ({ setClaimData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    policyId: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    location: null,
    damageEstimate: '',
    claimAmount: '',
    policeReportFile: null,
    hospitalReport: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, incidentDate: date }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({ ...prev, incidentTime: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      incidentTiming: `${formData.incidentDate}T${formData.incidentTime}`
    };
    if (setClaimData) {
      setClaimData(submissionData);
    }
    console.log('Submitting Claim:', submissionData);
    navigate('/processing');
  };

  return (
    <div className="submission-page hero-reveal">
      <div className="container mini-container">
        <div className="card submission-card">
          <div className="card-inner">
            <header className="form-header">
              <h1>Claim Submission</h1>
              <p>Required Fields</p>
            </header>

            <form onSubmit={handleSubmit} className="vertical-form">
              {/* 1. Policy ID */}
              <div className="form-group">
                <label className="form-label" htmlFor="policyId">Policy ID</label>
                <div className="input-with-icon">
                  <FileText className="input-icon" size={18} />
                  <input 
                    type="text" 
                    id="policyId"
                    name="policyId"
                    placeholder="Enter Policy ID"
                    value={formData.policyId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* 2. Incident Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="incidentType">Incident Type</label>
                <div className="input-with-icon">
                  <Activity className="input-icon" size={18} />
                  <select 
                    id="incidentType"
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Incident Type</option>
                    {incidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Incident Timing */}
              <div className="form-group">
                <label className="form-label">Incident Timing</label>
                <div className="datetime-grid">
                  <DatePicker value={formData.incidentDate} onChange={handleDateChange} />
                  <TimePicker value={formData.incidentTime} onChange={handleTimeChange} />
                </div>
              </div>

              {/* 4. Location Coordinates */}
              <div className="form-group">
                <label className="form-label">Location Coordinates</label>
                <MapSelector onLocationSelect={handleLocationSelect} />
              </div>

              {/* 5. Damage Estimate */}
              <div className="form-group">
                <label className="form-label" htmlFor="damageEstimate">Damage Estimate</label>
                <div className="input-with-icon">
                  <IndianRupee className="input-icon" size={18} />
                  <input 
                    type="number" 
                    id="damageEstimate"
                    name="damageEstimate"
                    placeholder="Estimated repair cost"
                    value={formData.damageEstimate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* 6. Claim Amount */}
              <div className="form-group">
                <label className="form-label" htmlFor="claimAmount">Claim Amount</label>
                <div className="input-with-icon">
                  <IndianRupee className="input-icon" size={18} />
                  <input 
                    type="number" 
                    id="claimAmount"
                    name="claimAmount"
                    placeholder="Requested claim amount"
                    value={formData.claimAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* 7. Police Report File */}
              <div className="form-group">
                <label className="form-label">Police Report File</label>
                <label className="file-upload-wrapper" htmlFor="policeReportFile">
                  <Upload className="file-icon" size={20} />
                  <span className="file-placeholder">
                    {formData.policeReportFile ? formData.policeReportFile.name : 'Choose or drag police report'}
                  </span>
                  <input 
                    type="file" 
                    id="policeReportFile"
                    name="policeReportFile"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden-file-input"
                  />
                </label>
              </div>

              {/* 8. Hospital Report */}
              <div className="form-group">
                <label className="form-label">Hospital Report</label>
                <label className="file-upload-wrapper" htmlFor="hospitalReport">
                  <Upload className="file-icon" size={20} />
                  <span className="file-placeholder">
                    {formData.hospitalReport ? formData.hospitalReport.name : 'Choose or drag hospital report'}
                  </span>
                  <input 
                    type="file" 
                    id="hospitalReport"
                    name="hospitalReport"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden-file-input"
                  />
                </label>
              </div>

              {/* Submission Notice */}
              <div className="submission-disclaimer">
                <AlertCircle size={16} />
                <span>Once submitted, this claim report cannot be edited or updated.</span>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-submit">
                Submit Final Claim
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .submission-page {
          padding-top: var(--space-xl);
          padding-bottom: var(--space-xl);
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          background: var(--bg);
        }

        .mini-container {
          max-width: 600px !important;
          width: 100%;
          margin: 0 auto;
        }

        .submission-card {
          border: 2px solid var(--border-bold);
          box-shadow: 10px 10px 0 var(--border-bold);
          background: var(--bg-soft);
          padding: 0;
          overflow: hidden;
        }

        .card-inner {
          padding: 3rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-header h1 {
          font-size: 2rem;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: var(--primary);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .vertical-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-label {
          margin-bottom: 0.75rem;
          color: var(--text);
          font-weight: 700;
          font-family: var(--font-heading);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input,
        .input-with-icon select {
          padding-left: 42px !important;
        }

        .datetime-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .file-upload-wrapper {
          position: relative;
          border: 2px dashed var(--border-bold);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: var(--bg);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .file-placeholder {
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-upload-wrapper:hover {
          border-color: var(--primary);
          background: #FFF7ED;
        }

        .file-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .hidden-file-input {
          display: none;
        }

        .submission-disclaimer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem;
          background: #FEFEFE;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          color: var(--danger);
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .btn-submit {
          width: 100%;
          padding: 1.25rem;
          font-size: 1rem;
          margin-top: 1rem;
          letter-spacing: 0.1em;
        }

        @media (max-width: 640px) {
          .card-inner {
            padding: 1.5rem;
          }
          .submission-page {
            padding: var(--space-md);
            align-items: flex-start;
          }
          .form-header {
            margin-bottom: 1.5rem;
          }
          .form-header h1 {
            font-size: 1.5rem;
          }
          .datetime-grid {
            grid-template-columns: 1fr;
          }
          .file-upload-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-submit {
            margin-top: 0.5rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmissionPage;
