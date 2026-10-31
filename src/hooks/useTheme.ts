// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, ThemeTokens } from '../theme/Color';

export function useTheme(): ThemeTokens {
  const colorScheme = useColorScheme();

  // If system theme is dark, use DarkTheme, otherwise default to LightTheme
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
}