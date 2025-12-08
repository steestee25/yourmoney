// app/_layout.tsx
import LoadingIndicator from '@/components/LoadingIndicator'
import { Stack } from 'expo-router'
import { AppState, StyleSheet } from 'react-native'
import CelebrationScreen from '../components/CelebrationScreen'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { I18nProvider } from '../lib/i18n'
import { supabase } from '../lib/supabase'
import Auth from './auth'

// Global listener that starts/stops auto token refresh based on app state
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

function RootLayoutContent() {
  // Get auth state values from context
  const { session, loading, isOnboarding, isCelebrating, endCelebration } = useAuth()

  if (loading) return <LoadingIndicator />
  if (isCelebrating) return <CelebrationScreen onFinish={endCelebration} />
  if (!session || isOnboarding) return <Auth /> // Show auth stack (login/signup/onboarding)

  // In all other cases, show the main app stack (tabs)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </I18nProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})
