import { describe, it, expect, beforeEach, vi } from 'vitest';
import StorageService from './storage';

describe('StorageService', () => {
  
  // On vide le localStorage avant chaque test pour repartir à zéro
  beforeEach(() => {
    localStorage.clear();
  });

  describe('User Data Management (JSON)', () => {
    it('should stringify user data when saving and parse when retrieving', () => {
      const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
      
      StorageService.setUser(userData);
      
      // Vérification que c'est bien stocké en string dans le localStorage
      expect(typeof localStorage.getItem('user')).toBe('string');
      
      // Vérification que le service nous redonne un objet propre
      const retrievedUser = StorageService.getUser();
      expect(retrievedUser).toEqual(userData);
      expect(retrievedUser.name).toBe('John Doe');
    });

    it('should return null if no user data exists', () => {
      expect(StorageService.getUser()).toBeNull();
    });
  });

  describe('Role and Theme Management', () => {
    it('should manage user roles', () => {
      StorageService.setRole('chef');
      expect(StorageService.getRole()).toBe('chef');
    });

    it('should manage theme preferences', () => {
      StorageService.setTheme('dark');
      expect(StorageService.getTheme()).toBe('dark');
    });
  });

  describe('clearAuth', () => {
    it('should clear all auth related data but keep other keys', () => {
      // Data à supprimer
      StorageService.setRole('chef');
      StorageService.setUser({ name: 'John' });
      
      // Data à garder (la clé API Gemini et le thème ne sont pas dans clearAuth)
      StorageService.setTheme('light');
      StorageService.setGeminiKey('api-key-123');

      StorageService.clearAuth();

      // Vérification suppressions
      expect(StorageService.getRole()).toBeNull();
      expect(StorageService.getUser()).toBeNull();

      // Vérification persistence du reste
      expect(StorageService.getTheme()).toBe('light');
      expect(StorageService.getGeminiKey()).toBe('api-key-123');
    });
  });
});