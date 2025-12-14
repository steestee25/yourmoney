import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/color';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Avatar = ({ uri }: { uri?: string }) => (
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
  const { session } = useAuth()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.log('Error fetching profile:', error.message || error)
          return
        }

        setProfile(data || null)
      } catch (err) {
        console.log('Unexpected error fetching profile:', err)
      }
    }

    fetchProfile()
  }, [session])

  const displayName = profile?.full_name || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User'
  const displayEmail = session?.user?.email || ''
  const avatarUri = session?.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff`

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Avatar uri={avatarUri} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.whiteCard}>
        <RowItem label="Account Information" />
        <RowItem label="Change Password" />
        <RowItem label="Device" />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Settings</Text>
      <View style={styles.whiteCard}>
        <RowItem label="Settings" />
        <RowItem label="Help & Support" />
        <RowItem label="About" />
      </View>
      
      <View style={styles.redCard}>
        <RowItem label="Logout" />
      </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20, paddingBottom: 20 },
  // leave space so content doesn't scroll under the tab bar
  scroll: { flex: 1, marginBottom: 85 },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginTop: '10%',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  email: { color: '#7b6f8b', marginTop: 2 },
  editBtn: {
    backgroundColor: COLORS.primaryLightOpacity,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editText: { color: COLORS.primaryLightOpacityFill, fontWeight: '600' },

  sectionTitle: { color: COLORS.temp, fontSize:16, marginTop:'3%', marginBottom: 8, fontWeight: '500' },
  whiteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  redCard: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    padding: 15,
    marginTop: '5%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#efe6ff',
    marginRight: 14,
  },
  rowLabel: { fontSize: 15, color: COLORS.temp, fontWeight: '500' },
  chev: { color: '#bdb3c8', fontSize: 20},
})