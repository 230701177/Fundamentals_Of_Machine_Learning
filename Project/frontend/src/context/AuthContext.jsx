import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Mock login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setUser({
            id: '1',
            name: 'Authorized User',
            email: email,
            role: 'SmartClaim User',
            createdDate: 'Oct 12, 2025'
          });
          resolve({ success: true });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          setUser({
            id: '1',
            name: name,
            email: email,
            role: 'SmartClaim User',
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          resolve({ success: true });
        } else {
          reject(new Error('Please fill all fields'));
        }
      }, 800);
    });
  };

  const updateProfile = async (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(prev => ({ ...prev, ...updates }));
        resolve({ success: true });
      }, 500);
    });
  };

  const changePassword = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === 'password123' || true) { // Mock validation
          resolve({ success: true });
        } else {
          reject(new Error('Incorrect current password'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
