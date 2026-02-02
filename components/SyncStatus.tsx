import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface SyncStatusProps {
  isOnline: boolean;
  isSyncing?: boolean;
  syncMessage?: string;
}

export default function SyncStatus({ isOnline, isSyncing, syncMessage }: SyncStatusProps) {
  if (!isSyncing && isOnline) {
    // Non mostriamo nulla se online e non in sincronizzazione
    return null;
  }

  const backgroundColor = isSyncing ? '#FFA500' : isOnline ? '#4CAF50' : '#F44336';
  const icon = isSyncing ? 'reload' : isOnline ? 'cloud-done' : 'cloud-offline';
  const message = syncMessage || (isSyncing ? 'Sincronizzazione...' : isOnline ? 'Sincronizzato' : 'Offline');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {isSyncing ? (
        <ActivityIndicator size="small" color="#fff" style={styles.icon} />
      ) : (
        <Ionicons name={icon} size={16} color="#fff" style={styles.icon} />
      )}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
