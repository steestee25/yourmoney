import React, { useEffect, useRef } from 'react'
import { Animated, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '@/constants/color'

type Props = {
  visible: boolean
  message: string
  onClose: () => void
}

export default function ErrorDialog({ visible, message, onClose }: Props) {
  const scale = useRef(new Animated.Value(0.8)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, opacity, scale])

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <MaterialIcons name="error-outline" size={36} color="#ff5f5f" />
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    padding: 25,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: '#333',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15,
    color: '#444',
    maxWidth: '90%',
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
})
