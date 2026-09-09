// theme.ts
export type ThemeMode = 'light' | 'dark';

export const colors = {
  dark: {
    background: '#0B0F17',
    cardBackground: '#131924',
    cardBorder: '#1E2638',
    
    primary: '#6366F1',
    primaryButtonText: '#FFFFFF',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    badgeBackground: '#1E293B',
    badgeText: '#94A3B8',

    successBadgeBg: '#064E3B',
    successBadgeText: '#34D399',

    warningBadgeBg: '#451A03',
    warningBadgeText: '#F59E0B',
    
    dashedBorder: '#334155',
    divider: '#1E293B',
  },
  light: {
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardBorder: '#E2E8F0',
    
    primary: '#4F46E5',
    primaryButtonText: '#FFFFFF',
    
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',

    badgeBackground: '#F1F5F9',
    badgeText: '#475569',

    successBadgeBg: '#D1FAE5',
    successBadgeText: '#065F46',

    warningBadgeBg: '#FEF3C7',
    warningBadgeText: '#92400E',

    dashedBorder: '#CBD5E1',
    divider: '#F1F5F9',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};