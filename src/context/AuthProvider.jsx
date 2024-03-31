// AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = exp * 1000;
      const currentTime = Date.now();

      if (currentTime < expirationTime) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setAuthenticated(false);
        navigate('/');
      }
    } else {
      setAuthenticated(false);
      navigate('/');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
