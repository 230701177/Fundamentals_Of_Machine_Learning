import React, { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('smartclaim_profile');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      onboardingCompleted: false
    };
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('smartclaim_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('smartclaim_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('smartclaim_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const updateProfile = (data) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: Date.now().toString(),
      addedDate: new Date().toLocaleDateString()
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const removeVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const updateVehicle = (id, updates) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const completeOnboarding = () => {
    setProfile(prev => ({ ...prev, onboardingCompleted: true }));
  };

  const resetAllData = () => {
    const emptyProfile = {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      onboardingCompleted: false
    };
    setProfile(emptyProfile);
    setVehicles([]);
    localStorage.removeItem('smartclaim_profile');
    localStorage.removeItem('smartclaim_vehicles');
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      vehicles, 
      updateProfile, 
      addVehicle, 
      removeVehicle, 
      updateVehicle,
      completeOnboarding,
      resetAllData
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
