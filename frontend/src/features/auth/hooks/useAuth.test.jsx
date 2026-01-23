import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from './useAuth';
import { AuthContext } from '@/context/AuthContext';
import React from 'react';

describe('useAuth Hook', () => {

  it('should throw an error when used outside of AuthProvider', () => {
    // On supprime temporairement le log d'erreur de la console pour garder un terminal propre
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when used within AuthProvider', () => {
    // On simule une valeur de contexte
    const mockUser = { id: 1, name: 'Admin', role: 'chef' };
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
        {children}
      </AuthContext.Provider>
    );

    // On rend le hook à l'intérieur du wrapper (le Provider)
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});