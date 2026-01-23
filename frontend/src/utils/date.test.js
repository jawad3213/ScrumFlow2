import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, getRelativeTime } from './date';

describe('Date Utilities', () => {
  
  describe('formatDate', () => {
    it('should format a valid date string correctly', () => {
      const result = formatDate('2024-01-20');
      expect(result).toBe('Jan 20, 2024');
    });

    it('should return an empty string if no date is provided', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('should respect custom options', () => {
      const result = formatDate('2024-01-20', { month: 'long' });
      expect(result).toBe('January 20, 2024');
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      // On fixe la date système pour éviter que les tests échouent demain
      vi.useFakeTimers();
      const mockDate = new Date('2024-01-20T12:00:00Z');
      vi.setSystemTime(mockDate);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "just now" for dates < 60s', () => {
      const thirtySecondsAgo = new Date('2024-01-20T11:59:30Z');
      expect(getRelativeTime(thirtySecondsAgo)).toBe('just now');
    });

    it('should return minutes ago', () => {
      const fiveMinsAgo = new Date('2024-01-20T11:55:00Z');
      expect(getRelativeTime(fiveMinsAgo)).toBe('5m ago');
    });

    it('should return hours ago', () => {
      const twoHoursAgo = new Date('2024-01-20T10:00:00Z');
      expect(getRelativeTime(twoHoursAgo)).toBe('2h ago');
    });

    it('should return days ago', () => {
      const threeDaysAgo = new Date('2024-01-17T12:00:00Z');
      expect(getRelativeTime(threeDaysAgo)).toBe('3d ago');
    });
  });
});