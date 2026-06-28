import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authState = useAuth();
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
