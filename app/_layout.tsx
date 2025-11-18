// app/_layout.tsx
import { Stack } from 'expo-router'
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Auth from './auth'
import CelebrationScreen from '../components/CelebrationScreen'

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

function RootLayoutContent() {
  const { session, loading, isOnboarding, isCelebrating, endCelebration } = useAuth()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9CF1F0" />
      </View>
    )
  }

  if (isCelebrating) {
    return <CelebrationScreen onFinish={endCelebration} />
  }

  if (!session || isOnboarding) {
    return <Auth />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
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
