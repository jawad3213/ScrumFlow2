import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '@/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('user_role');

        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setUserRole(storedRole);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('user_role', data.role);
                localStorage.setItem('user', JSON.stringify(data.user));

                setToken(data.access_token);
                setUserRole(data.role);
                setUser(data.user);
                return data;
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');

        setToken(null);
        setUserRole(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, userRole, token, login, logout, updateUser, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


