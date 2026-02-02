import React, { createContext, useState, useEffect, useContext } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        }
        setLoading(false);
    }, []);

    const loginUser = (token, userData) => {
        localStorage.setItem('token', token);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        setToken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    const value = {
        user,
        token,
        isLoggedIn,
        loading,
        loginUser,
        logout,
        setUser,
        setToken,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
