import { Octicons } from '@expo/vector-icons'
import React from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface Props {
  onNext: () => void
  loading: boolean
}

export default function InitialStep({ onNext, loading }: Props) {
  return (
    <View style={{ width: '100%' }}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSignIn]}
          onPress={onNext}
          disabled={loading}
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
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 400,
    alignSelf: 'center',
    marginBottom: '3%',
    marginTop: '30%',
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 10,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonSignIn: {
    backgroundColor: '#00ecec8d',
    marginTop: '10%',
  },
  buttonIcon: { marginRight: 8 },
  buttonContentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})
