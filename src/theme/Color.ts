// src/theme/Color.ts

// 1. Define strict type contracts so you never misspell a color token
export interface ThemeTokens {
  bg: string;
  card: string;
  primary: string;
  secondary: string;
  border: string;
  accent: string;
  // Common application status colors (often consistent across themes)
  success: string;
  danger: string;
}

const commonColors = {
  success: "#10B981", // Emerald green for checked tasks
  danger: "#EF4444",  // Soft red for skill gaps
};

// 2. Separate light and dark definitions cleanly
export const LightTheme: ThemeTokens = {
  bg: "#F6EFE5",
  card: "#FFFFFF",
  primary: "#162542",
  secondary: "#5C6B83",
  border: "#E6DDD0",
  accent: "#DCB44C",
  ...commonColors,
};

export const DarkTheme: ThemeTokens = {
  bg: "#0E182B",
  card: "#17233A",
  primary: "#F6EFE5",
  secondary: "#8A9BB4",
  border: "#23334F",
  accent: "#F1C443",
  ...commonColors,
};

// Global layouts tokens
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
};