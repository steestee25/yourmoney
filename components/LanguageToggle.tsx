import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from '../lib/i18n'

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setLocale('it')}
        style={[styles.button, locale === 'it' ? styles.active : {}]}
      >
        <Text style={[styles.label, locale === 'it' ? styles.activeLabel : {}]}>IT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setLocale('en')}
        style={[styles.button, locale === 'en' ? styles.active : {}]}
      >
        <Text style={[styles.label, locale === 'en' ? styles.activeLabel : {}]}>EN</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 8,
  },
  active: {
    backgroundColor: '#00C6D3',
    borderColor: '#00C6D3',
  },
  label: {
    fontWeight: '600',
  },
  activeLabel: {
    color: '#fff',
  },
})
