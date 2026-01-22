import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, isEmpty } from './validation';

describe('Validation Utilities', () => {

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false); // Manque l'extension (.com, .fr...)
      expect(isValidEmail('test @domain.com')).toBe(false); // Espace interdit
    });
  });

  describe('isValidPassword', () => {
    it('should return true if password meets all criteria', () => {
      // 8+ caractères, 1 lettre, 1 chiffre
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('P4ssword')).toBe(true);
    });

    it('should return false if password is too short', () => {
      expect(isValidPassword('Ab1')).toBe(false);
    });

    it('should return false if password lacks a number', () => {
      expect(isValidPassword('passwordOnly')).toBe(false);
    });

    it('should return false if password lacks a letter', () => {
      expect(isValidPassword('your_db_password6789')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty or whitespace strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  abc  ')).toBe(false);
      expect(isEmpty('0')).toBe(false); // Important : '0' n'est pas "vide"
    });
  });
});