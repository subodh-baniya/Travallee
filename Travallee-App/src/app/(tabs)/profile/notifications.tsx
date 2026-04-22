import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { RealixHeader, RealixScreen } from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';

export default function ProfileNotificationsScreen() {
  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader
        title="Notifications"
        showBack
      />

      {/* Notifications will be rendered here */}
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
});