import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = (newToken) => {
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
