import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface Props {
  email: string
  setEmail: (v: string) => void
  onNext: () => void
  onBack: () => void
}

export default function EmailStep({ email, setEmail, onNext, onBack }: Props) {
  const inputRef = useRef<TextInput>(null)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <MaterialIcons name="arrow-back" size={28} color="#00C6D3" />
      </TouchableOpacity>

      <Text style={styles.title}>Inserisci la tua email</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={onNext}
        autoFocus
      />

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Avanti</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  back: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00ecec8d',
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})
