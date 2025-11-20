import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  onFinish: () => void
}

export default function CelebrationScreen({ onFinish }: Props) {
  const hasFinished = useRef(false)

  const handleFinish = useCallback(() => {
    if (hasFinished.current) return
    hasFinished.current = true
    onFinish()
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(handleFinish, 5200)
    return () => clearTimeout(timer)
  }, [handleFinish])

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/coin_bounce.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleFinish}
        style={styles.lottie}
      />
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Getting your app ready...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
  },
  lottie: {
    width: 130,
    height: 130,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    color: '#1c1c1c',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
  },
})
