import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Octicons, MaterialIcons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

type AuthStep = 'initial' | 'email' | 'password'

export default function Auth() {
  const [step, setStep] = useState<AuthStep>('initial')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

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
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'email') {
        handleBackToInitial()
        return true
      } else if (step === 'password') {
        handleBackToEmail()
        return true
      }
      return false
    })

    return () => backHandler.remove()
  }, [step])

  const handleEmailNext = () => {
    if (!email) {
      Alert.alert('Please enter your email')
      return
    }
    setStep('password')
  }

  const handleBackToEmail = () => {
    setStep('email')
  }

  const handleBackToInitial = () => {
    setStep('initial')
    setEmail('')
    setPassword('')
  }

  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const signUpWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password')
      return
    }

    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) Alert.alert(error.message)
    else if (!session) Alert.alert('Please check your inbox for email verification!')

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Initial Screen */}
        {step === 'initial' && (
          <>
            <View>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.verticallySpaced, styles.mt10]}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSignIn]}
                disabled={loading}
                onPress={() => setStep('email')}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.buttonContentRow}>
                    <Octicons name="mail" size={24} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Login with Email</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Email Screen */}
        {step === 'email' && (
          <>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={handleBackToInitial}>
                <MaterialIcons name="arrow-back" size={28} color="#2ec7e5" />
              </TouchableOpacity>
            </View>

            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Enter your email</Text>
            </View>

            <View style={styles.verticallySpaced}>
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={handleEmailNext}
                autoFocus
              />
            </View>

            <View style={[styles.verticallySpaced, styles.mt10]}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSignIn]}
                onPress={handleEmailNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Password Screen */}
        {step === 'password' && (
          <>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={handleBackToEmail}>
                <MaterialIcons name="arrow-back" size={28} color="#2ec7e5" />
              </TouchableOpacity>
            </View>

            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Enter your password</Text>
              <Text style={styles.emailDisplay}>{email}</Text>
            </View>

            <View style={styles.verticallySpaced}>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Password"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={signInWithEmail}
                autoFocus
              />
            </View>

            <View style={[styles.rowButtons, styles.mt10]}>
              <View style={styles.halfButton}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSignUp]}
                  disabled={loading}
                  onPress={signUpWithEmail}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.halfButton}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSignIn]}
                  disabled={loading}
                  onPress={signInWithEmail}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    padding: 10,
  },
  logo: {
    width: 450,
    height: 450,
    alignSelf: 'center',
    marginBottom: '15%',
    marginTop: '30%',
  },
  backButton: {
    paddingHorizontal: '5%',
    paddingBottom: 16,
    paddingTop: 8,
  },
  stepContainer: {
    paddingHorizontal: '5%',
    marginBottom: 24,
    marginTop: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emailDisplay: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
    marginHorizontal: '5%',
  },
  mt10: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonSignIn: {
    backgroundColor: '#00ecec8d',
    marginBottom: 5,
  },
  buttonSignUp: {
    backgroundColor: '#2ec7e5d7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '5%',
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 6,
  },
})