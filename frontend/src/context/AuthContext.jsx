import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, refreshToken as apiRefresh, getMe, logout as apiLogout } from '@/features/auth/api/auth';
import StorageService from '@/utils/storage';
import { setAccessToken, clearAccessToken } from '@/lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    // Use a ref to track initialization to prevent double-calls in Strict Mode
    const initRef = React.useRef(false);

    useEffect(() => {
        // If already initializing, skip
        if (initRef.current) return;
        initRef.current = true;

        const silentRefresh = async () => {
            const isLoginPage = window.location.pathname.includes('/login');

            try {
                const storedUser = StorageService.getUser();
                const storedRole = StorageService.getRole();

                console.log('[Auth] Initializing session check. Stored user:', storedUser ? 'Found' : 'Not found');

                // If we have local data, restore it immediately for faster UI rendering
                if (storedUser) {
                    console.log('[Auth] Restoring user from storage');
                    setUser(storedUser);
                    setUserRole(storedRole);
                }

                // Optimisation: If on login page and no stored user, we don't try to refresh.
                // This avoids seeing a 401 error in the console for every new visitor.
                if (isLoginPage && !storedUser) {
                    console.log('[Auth] On login page without session hint, skipping silent check');
                    setLoading(false);
                    return;
                }

                // Attempt to refresh the token using the HttpOnly cookie
                try {
                    console.log('[Auth] Attempting token refresh...');
                    const data = await apiRefresh();

                    if (data && data.access_token) {
                        console.log('[Auth] Token refresh successful');
                        setAccessToken(data.access_token);
                        setToken(data.access_token);

                        // If we didn't have user data in localStorage (e.g. new tab or cleared), 
                        // fetch it from the backend now that we have a valid access token.
                        if (!storedUser) {
                            console.log('[Auth] No stored user but refresh worked, fetching user data...');
                            try {
                                const userData = await getMe();
                                if (userData) {
                                    console.log('[Auth] User identification successful:', userData.email);
                                    setUser(userData);
                                    setUserRole(userData.role);
                                    StorageService.setUser(userData);
                                    StorageService.setRole(userData.role);
                                }
                            } catch (meError) {
                                console.error('[Auth] Failed to fetch user profile after refresh:', meError);
                                // If /refresh worked but /me failed, we might have a ghost session
                                if (meError.response?.status === 401) {
                                    throw meError;
                                }
                            }
                        }
                    } else {
                        console.warn('[Auth] No access token in refresh response');
                        // No access token means we are likely logged out on the server too
                        // But we only clear if we thought we were logged in
                        if (storedUser) {
                            StorageService.clearAuth();
                            setUser(null);
                            setUserRole(null);
                        }
                    }
                } catch (refreshError) {
                    // Only log out if it's a true 401 Unauthorized (invalid refresh token)
                    if (refreshError.response?.status === 401) {
                        console.log('[Auth] session cookie invalid or expired (401)');

                        // Only clear if we actually had something to clear 
                        // to avoid unnecessary state updates
                        if (storedUser || user) {
                            StorageService.clearAuth();
                            setUser(null);
                            setUserRole(null);
                            clearAccessToken();
                        }

                        const isPublicPage = isLoginPage || window.location.pathname === '/';
                        if (!isPublicPage) {
                            console.log('[Auth] Redirecting to login...');
                            window.location.assign('/login');
                        }
                    } else {
                        // Network error or server 500 - keep the current local state
                        console.warn('[Auth] Refresh failed (Network/Server error). Local state preserved.');
                    }
                }
            } catch (error) {
                console.error("[Auth] Unexpected initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        silentRefresh();

        // Écouter les rafraîchissements de token (venant d'axios interceptor)
        const handleTokenRefreshed = (e) => {
            console.log('[Auth] Token refreshed via interceptor');
            setToken(e.detail);
        };

        window.addEventListener('auth-token-refreshed', handleTokenRefreshed);

        return () => {
            window.removeEventListener('auth-token-refreshed', handleTokenRefreshed);
        };
    }, []);

    const login = async (credentials) => {
        try {
            console.log('[Auth] Login called with:', credentials.email);
            const data = await apiLogin(credentials);
            console.log('[Auth] Login response received:', {
                hasAccessToken: !!data.access_token,
                hasUser: !!data.user,
                role: data.role
            });

            if (data.access_token) {
                // NE PAS STOCKER LE TOKEN DANS LE STORAGE
                console.log('[Auth] Saving to localStorage...');
                StorageService.setRole(data.role);
                StorageService.setUser(data.user);

                // Verify it was saved
                const savedUser = StorageService.getUser();
                console.log('[Auth] Verified localStorage after save:', savedUser ? 'User saved!' : 'SAVE FAILED!');

                setAccessToken(data.access_token);
                setToken(data.access_token);
                setUserRole(data.role);
                setUser(data.user);
                return data;
            }
        } catch (error) {
            console.error('[Auth] Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('[Auth] Logout error:', error);
        } finally {
            StorageService.clearAuth();
            clearAccessToken();
            setToken(null);
            setUserRole(null);
            setUser(null);
        }
    };

    const updateUser = (userData) => {
        StorageService.setUser(userData);
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userRole,
            token,
            login,
            logout,
            updateUser,
            isAuthenticated: !!user, // Modified: if we have a user, we are considered authenticated
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};


