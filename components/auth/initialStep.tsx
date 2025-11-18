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

import { COLORS } from '@/constants/color'

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
          style={styles.button}
          onPress={onNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.buttonContentRow}>
              <Octicons name="mail" size={24} color={COLORS.primary} style={styles.buttonIcon} />
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
    backgroundColor: COLORS.white,
    padding: 15,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: '10%',
    borderColor: COLORS.primary,
    borderWidth: 2.5,
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16
  },
})
