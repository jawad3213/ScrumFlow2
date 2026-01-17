import { describe, it, expect } from 'vitest';
import * as constants from './constants';

describe('Application Constants', () => {

  it('should have the correct USER_ROLES values', () => {
    // On vérifie que les clés et les valeurs n'ont pas changé (crucial pour les rôles en DB)
    expect(constants.USER_ROLES).toEqual({
      MANAGER: 'chef',
      MEMBER: 'membre'
    });
  });

  it('should define all required PROJECT_STATUS', () => {
    const expectedStatus = ['active', 'pending', 'completed', 'archived'];
    expect(Object.values(constants.PROJECT_STATUS)).toEqual(expect.arrayContaining(expectedStatus));
    expect(Object.keys(constants.PROJECT_STATUS).length).toBe(4);
  });

  describe('ROLE_LEVELS and ALL_ROLES', () => {
    it('should sync ALL_ROLES with ROLE_LEVELS keys', () => {
      // Vérifie que ALL_ROLES contient bien toutes les clés du dictionnaire
      const keys = Object.keys(constants.ROLE_LEVELS);
      expect(constants.ALL_ROLES).toEqual(keys);
    });

    it('should have specific levels for Frontend Developer', () => {
      expect(constants.ROLE_LEVELS['Frontend Developer']).toContain('Junior');
      expect(constants.ROLE_LEVELS['Frontend Developer']).toContain('Software Architect');
    });
  });

  describe('LEVEL_ORDER Integrity', () => {
    it('should be an array of strings', () => {
      expect(Array.isArray(constants.LEVEL_ORDER)).toBe(true);
      expect(typeof constants.LEVEL_ORDER[0]).toBe('string');
    });

    it('should contain key seniority levels', () => {
      // On s'assure que les piliers de la hiérarchie sont présents
      const criticalLevels = ['Intern', 'Senior', 'Software Architect'];
      criticalLevels.forEach(level => {
        expect(constants.LEVEL_ORDER).toContain(level);
      });
    });
  });
});