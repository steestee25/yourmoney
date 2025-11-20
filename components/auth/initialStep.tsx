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
      <View style={styles.logoView}>
        <Image
          source={require('../../assets/images/coin_logo_no_bg.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Image
        source={require('../../assets/images/main3.png')}
        style={{ width: '105%', height: 450 }}
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
              <Text style={styles.buttonText}>Login with Email</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  logoView: {
    height: 80,
    width: 80,
    backgroundColor: COLORS.temp2,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: '20%'
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 10,
  },
  button: {
    backgroundColor: COLORS.primaryLight,
    padding: 15,
    alignItems: 'center',
    borderRadius: 15,
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
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16
  },
})
