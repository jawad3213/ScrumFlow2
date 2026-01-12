import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '@/api';
import StorageService from '@/utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(StorageService.getToken());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = StorageService.getUser();
        const storedRole = StorageService.getRole();

        if (storedUser && storedRole) {
            setUser(storedUser);
            setUserRole(storedRole);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            if (data.access_token) {
                StorageService.setToken(data.access_token);
                StorageService.setRole(data.role);
                StorageService.setUser(data.user);

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
        StorageService.clearAuth();

        setToken(null);
        setUserRole(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        StorageService.setUser(userData);
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, userRole, token, login, logout, updateUser, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


