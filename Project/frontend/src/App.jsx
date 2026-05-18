import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SubmissionPage from './pages/SubmissionPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import OnboardingPage from './pages/OnboardingPage';

const App = () => {
  const [claimData, setClaimData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleClaimSubmit = (data) => {
    setClaimData(data);
    
    // For demo purposes, we simulate the prediction logic based on inputs
    // In a real app, this would be an API call to the backend
    const riskScore = calculateMockRisk(data);
    
    // Simulate API logic to match user's requested JSON structure
    // We'll intentionally trigger an error if the policy ID is "ERR-DATA" for testing
    if (data.policyId === "ERR-DATA") {
      setPrediction({
        status: "error",
        message: "Location api issue : 'flowSegmentData'"
      });
    } else {
      setPrediction({
        status: "success",
        data: {
          approval_probability: 1 - riskScore,
          rejection_probability: riskScore
        }
      });
    }
  };

  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/submit" 
                element={<SubmissionPage setClaimData={handleClaimSubmit} />} 
              />
              <Route path="/processing" element={<ProcessingPage claimData={claimData} prediction={prediction} />} />
              <Route path="/results" element={<ResultPage claimData={claimData} prediction={prediction} />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
};

// Simple logic generator for demo/hackathon feel
function calculateMockRisk(data) {
  if (!data) return 0.1;
  
  let score = 0.1;
  
  // Basic claim factors
  const amount = Number(data.claimAmount) || 0;
  if (amount > 10000) score += 0.2;
  
  // Validate specific incident types
  if (data.incidentType === 'Theft' && !data.policeReportFile) score += 0.4;
  if (data.incidentType === 'Accident' && !data.policeReportFile) score += 0.2;
  
  // Damage versus Claim check
  const estimate = Number(data.damageEstimate) || 0;
  if (amount > estimate * 1.5) score += 0.3; // Much more suspicious if claim > estimate

  return Math.max(0.05, Math.min(score, 0.95));
}

function generateExplanation(data, score) {
  if (!data) return "Initializing assessment...";

  let explanation = "";
  
  if (score < 0.3) {
    explanation = `Claim for ${data.incidentType} appears legitimate. `;
    explanation += "Low risk parameters and matching estimates support instant approval.";
  } else if (score < 0.6) {
    explanation = "Moderate risk detected. ";
    if (data.claimAmount > data.damageEstimate) {
      explanation += "Claim amount exceeds initial damage estimate. Manual verification required.";
    } else {
      explanation += "Suggest manual review of uploaded reports for final validation.";
    }
  } else {
    explanation = "High risk profile identified. ";
    if (!data.policeReportFile && (data.incidentType === 'Theft' || data.incidentType === 'Accident')) {
      explanation += "Missing mandatory police report for critical incident type.";
    } else {
      explanation += "Suspicious patterns detected in claim amount versus damage estimation.";
    }
  }
  
  return explanation;
}

export default App;
