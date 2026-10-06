import { useEffect } from 'react';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { Loading } from '../components/ScreenState';
import { restoreSession, useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

export function AppNavigator() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  if (!hydrated) return <Loading />;

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
