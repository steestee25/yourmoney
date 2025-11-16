import React, { useEffect, useState } from 'react'
import {
  AppState,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native'
import EmailStep from '../components/auth/emailStep'
import InitialStep from '../components/auth/initialStep'
import NameStep from '../components/auth/nameStep'
import PasswordStep from '../components/auth/passwordStep'
import { supabase } from '../lib/supabase'

type AuthStep = 'initial' | 'email' | 'password' | 'name'

export default function AuthScreen() {
  const [step, setStep] = useState<AuthStep>('initial')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      state === 'active'
        ? supabase.auth.startAutoRefresh()
        : supabase.auth.stopAutoRefresh()
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'email') {
        setStep('initial')
        return true
      }
      if (step === 'password') {
        setStep('email')
        return true
      }
      if (step === 'name') {
        setStep('password')
        return true
      }
      return false
    })
    return () => handler.remove()
  }, [step])

  const handleAuth = async (mode: 'signIn' | 'signUp') => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)

    const action =
      mode === 'signIn'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { data, error } = await action

    if (error) alert(error.message)
    else if (mode === 'signUp' && !data.session)
      alert('Please check your inbox for verification')

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {step === 'initial' && (
          <InitialStep onNext={() => setStep('email')} loading={loading} />
        )}

        {step === 'email' && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onNext={() => setStep('password')}
            onBack={() => setStep('initial')}
          />
        )}

        {step === 'password' && (
          <PasswordStep
            email={email}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onBack={() => setStep('email')}
            onSignIn={() => handleAuth('signIn')}
            onSignUp={() => handleAuth('signUp')}
          />
        )}

        {step === 'name' && (
          <NameStep
            name={name}
            setName={setName}
            onBack={() => setStep('password')}
            onNext={() => {
              // per ora non andiamo avanti, il prossimo step sarà il questionario
              // nei passi successivi gli faremo fare qualcosa (es. setStep('questionnaire'))
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    marginTop: '8%',
  },
})
