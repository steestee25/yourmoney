import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  AppState,
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
import { Octicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import ErrorDialog from './ErrorDialog'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
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

  const signInWithEmail = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setErrorMessage(error.message)
    setLoading(false)
  }

  const signUpWithEmail = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password')
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

    if (error) setErrorMessage(error.message)
    else if (!session) setErrorMessage('Please check your inbox for email verification!')

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
        <View>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
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
          />
        </View>

        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSignIn]}
            disabled={loading}
            onPress={signInWithEmail}
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

        <View style={styles.verticallySpaced}>
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
      </ScrollView>

      <ErrorDialog
        visible={Boolean(errorMessage)}
        message={errorMessage || ''}
        onClose={() => setErrorMessage(null)}
      />
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
    width: 400,
    height: 400,
    alignSelf: 'center',
    marginBottom: '3%',
    marginTop: '8%',
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
    marginHorizontal: '5%',
  },
  mt20: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
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
    fontSize: 16,
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
})
