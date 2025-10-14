// app/_layout.tsx - ROOT LAYOUT
import { Session } from '@supabase/supabase-js'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native'
import Auth from '../components/Auth'
import { supabase } from '../lib/supabase'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Controlla la sessione corrente all'avvio
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Ascolta i cambiamenti dello stato di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup: rimuovi il listener quando il componente viene smontato
    return () => subscription.unsubscribe()
  }, [])

  // Mostra un loading mentre verifica la sessione
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9CF1F0" />
      </View>
    )
  }

  // Se non c'è sessione, mostra la schermata di autenticazione
  if (!session) {
    return <Auth />
  }

  // Se c'è una sessione attiva, mostra la navigazione normale con le tabs
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
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