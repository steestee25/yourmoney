import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface Props {
  email: string
  password: string
  setPassword: (v: string) => void
  onBack: () => void
  onSignIn: () => void
  onSignUp: () => void
  loading: boolean
}

export default function PasswordStep({
  email,
  password,
  setPassword,
  onBack,
  onSignIn,
  onSignUp,
  loading,
}: Props) {
  const inputRef = useRef<TextInput>(null)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <MaterialIcons name="arrow-back" size={28} color="#00C6D3" />
      </TouchableOpacity>

      <Text style={styles.title}>Inserisci la password</Text>
      <Text style={styles.subtitle}>{email}</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={onSignIn}
        autoFocus
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.signup]} onPress={onSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrati</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.signin]} onPress={onSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Accedi</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  back: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  signup: { backgroundColor: '#2ec7e5d7' },
  signin: { backgroundColor: '#00ecec8d' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})
