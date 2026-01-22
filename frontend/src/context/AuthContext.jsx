import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, refreshToken as apiRefresh } from '@/features/auth/api/auth';
import StorageService from '@/utils/storage';
import { setAccessToken, clearAccessToken } from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const silentRefresh = async () => {
            const storedUser = StorageService.getUser();
            const storedRole = StorageService.getRole();

            // S'il n'y a pas d'utilisateur stocké, on ne tente pas de refresh (session inexistante)
            if (!storedUser) {
                setLoading(false);
                return;
            }

            try {
                const data = await apiRefresh();
                if (data.access_token) {
                    setAccessToken(data.access_token);
                    setToken(data.access_token);
                    setUser(storedUser);
                    setUserRole(storedRole);
                }
            } catch (error) {
                console.error("Silent refresh failed:", error);
                StorageService.clearAuth();
                clearAccessToken();
            } finally {
                setLoading(false);
            }
        };

        silentRefresh();

        // Écouter les rafraîchissements de token (venant d'axios interceptor)
        const handleTokenRefreshed = (e) => {
            setToken(e.detail);
        };

        window.addEventListener('auth-token-refreshed', handleTokenRefreshed);

        return () => {
            window.removeEventListener('auth-token-refreshed', handleTokenRefreshed);
        };
    }, []);

    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            if (data.access_token) {
                // NE PAS STOCKER LE TOKEN DANS LE STORAGE
                StorageService.setRole(data.role);
                StorageService.setUser(data.user);

                setAccessToken(data.access_token);
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
        clearAccessToken();

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


