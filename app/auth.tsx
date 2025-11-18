import React, { useEffect, useRef, useState } from 'react'
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
import QuestionnaireStep, { QuestionnaireStepHandle } from '../components/auth/questionnaireStep'
import ErrorDialog from '../components/ErrorDialog'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type AuthStep = 'initial' | 'email' | 'password' | 'name' | 'questionnaire'

export default function AuthScreen() {
  const [step, setStep] = useState<AuthStep>('initial')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [questionnaire, setQuestionnaire] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { beginOnboarding, startCelebration } = useAuth()
  const questionnaireRef = useRef<QuestionnaireStepHandle>(null)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
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
        // Once on the name step we don't allow going back to password/email
        return true
      }
      if (step === 'questionnaire') {
        questionnaireRef.current?.goBack()
        return true
      }
      return false
    })
    return () => handler.remove()
  }, [step])

  const handleAuth = async (mode: 'signIn' | 'signUp') => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password')
      return
    }

    setLoading(true)

    const action =
      mode === 'signIn'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { error } = await action

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    if (mode === 'signIn') {
      setLoading(false)
      startCelebration()
      return
    }

    // Sign up succeeded, move forward in the onboarding flow
    setLoading(false)
    beginOnboarding()
    setStep('name')
  }

  const handleNameNext = () => {
    setStep('questionnaire')
    // Next onboarding steps (e.g. questionnaire) can be triggered here later on
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="always">
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
          <NameStep name={name} setName={setName} onNext={handleNameNext} />
        )}

        {step === 'questionnaire' && (
          <QuestionnaireStep
            ref={questionnaireRef}
            onBack={() => setStep('name')}
            onComplete={(answers) => {
              setQuestionnaire(answers)
              // next: save to DB then celebrate and finish onboarding
              startCelebration()
            }}
          />
        )}

        <ErrorDialog
          visible={!!errorMessage}
          message={errorMessage ?? ''}
          onClose={() => setErrorMessage(null)}
        />

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
