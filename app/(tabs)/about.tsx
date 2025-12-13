import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const Avatar = () => (
  <View style={styles.avatarWrap}>
    <Image
      source={{ uri: 'https://picsum.photos/100' }}
      style={styles.avatar}
    />
  </View>
)

function RowItem({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <Pressable style={styles.row} android_ripple={{ color: '#eee' }}>
      <View style={styles.rowLeft}>
        <View style={styles.iconPlaceholder} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  )
}

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Avatar />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>Ethan Cole</Text>
            <Text style={styles.email}>ethancoleux@gmail.com</Text>
          </View>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.premiumCard}>
        <View style={styles.premiumLeft}>
          <View style={styles.premiumIcon} />
          <View>
            <Text style={styles.premiumTitle}>Premium Account</Text>
            <Text style={styles.premiumSubtitle}>Enjoy your premium features</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.whiteCard}>
        <RowItem label="Account Information" />
        <RowItem label="Change Password" />
        <RowItem label="Device" />
        <RowItem label="Connect to Banks" />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Settings</Text>
      <View style={styles.whiteCard}>
        <RowItem label="Settings" />
        <RowItem label="Help & Support" />
        <RowItem label="About" />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eef6' },
  content: { padding: 20, paddingBottom: 80 },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    elevation: 1,
    marginTop: '10%',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  email: { color: '#7b6f8b', marginTop: 2 },
  editBtn: {
    backgroundColor: '#f2eefe',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editText: { color: '#4b2c91', fontWeight: '600' },

  premiumCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    // simple gradient-ish feel with opacity
  },
  premiumLeft: { flexDirection: 'row', alignItems: 'center' },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 12,
  },
  premiumTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  premiumSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  sectionTitle: { color: '#8a8098', marginBottom: 8, fontWeight: '500' },
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#efe6ff',
    marginRight: 12,
  },
  rowLabel: { fontSize: 15, color: '#16121a' },
  chev: { color: '#bdb3c8', fontSize: 20 },
})