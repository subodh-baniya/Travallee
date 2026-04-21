import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Switch, Text, View, Image } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import {
  RealixCard,
  RealixHeader,
  RealixListRow,
  RealixScreen,
  RealixSectionLabel,
} from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';
import axios from 'axios';
import { API_ENDPOINTS_AUTH } from '@/src/constants/api';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { useEffect } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const API_PROFILE = API_ENDPOINTS_AUTH.PROFILE;
  const API_PROFILE_IMAGE = API_ENDPOINTS_AUTH.USER_PROFILE;
  
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load location preference on mount
  useEffect(() => {
    const loadLocationPreference = async () => {
      try {
        const saved = await SecureStore.getItemAsync('locationEnabled');
        setLocationEnabled(saved === 'true');
      } catch (err) {
        console.error('Failed to load location preference:', err);
      } finally {
        setLocationLoading(false);
      }
    };
    loadLocationPreference();
  }, []);

  // Handle location toggle
  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      // Enabling location - request permission
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationEnabled(true);
          await SecureStore.setItemAsync('locationEnabled', 'true');
          Alert.alert('Success', 'Location enabled. You can now see nearby properties.');
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to enable location services. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          setLocationEnabled(false);
        }
      } catch (err: any) {
        console.error('Error requesting location permission:', err);
        Alert.alert('Error', 'Failed to request location permission');
        setLocationEnabled(false);
      }
    } else {
      // Disabling location
      setLocationEnabled(false);
      await SecureStore.setItemAsync('locationEnabled', 'false');
      Alert.alert('Success', 'Location disabled. Location data will not be tracked.');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("userToken");
        if (!token) return;

        const response = await axios.get(API_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success && response.data.data) {
          setProfileData(response.data.data);
        }
      } catch (err: any) {
        console.error("Failed to load profile details", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

   useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setProfileLoading(true);
        
        const token = await SecureStore.getItemAsync("userToken");
        
        if (!token) {
          setProfileLoading(false);
          return;
        }

        const response = await axios.get(API_PROFILE_IMAGE, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        });
        
        if (response.data.success && response.data.data?.profilePicture) {
          setProfileImage(response.data.data.profilePicture);
        }
      } catch (err: any) {
        // Silent error - avatar shows empty if profile fetch fails
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/signin' as never);
  };

  const displayName = profileData?.Name || user?.name || "Kc Prabin";
  const displayEmail = profileData?.email || user?.email || "prabin@example.com";
  
  const initials = displayName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase().substring(0, 2) || "U";

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="Profile" />

      <RealixCard style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.profileAvatar}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileAvatarImage}
              />
            ) : (
              <Text style={styles.profileAvatarText}>{initials}</Text>
            )}
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>
              {loading ? "Loading..." : displayName}
            </Text>
            <Text style={styles.profileEmail}>{displayEmail}</Text>
          </View>
        </View>
      </RealixCard>

      <RealixSectionLabel>General</RealixSectionLabel>
      <RealixCard>
        <RealixListRow
          label="Profile"
          leading={<Ionicons name="person-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/edit')}
        />
        <RealixListRow
          label="Language"
          leading={<Ionicons name="language-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/language')}
        />
        <RealixListRow
          label="Notifications"
          leading={<Ionicons name="mail-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/notifications')}
        />
        <RealixListRow
          label="Notification Settings"
          leading={<Ionicons name="notifications-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/notification-settings')}
        />
        <RealixListRow
          label="History"
          leading={<Ionicons name="time-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/history')}
        />
        <RealixListRow
          label="Reviews"
          leading={<Ionicons name="star-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/review')}
        />
        <RealixListRow
          label="Location"
          leading={<Ionicons name="location-outline" size={18} color={RealixColors.textSecondary} />}
          trailing={
            <Switch
              value={locationEnabled}
              onValueChange={handleLocationToggle}
              disabled={locationLoading}
              trackColor={{ false: '#3a3a3a', true: RealixColors.accentToggle }}
              thumbColor="#ffffff"
            />
          }
        />
      </RealixCard>

      <RealixSectionLabel>Account and security</RealixSectionLabel>
      <RealixCard>
        <RealixListRow
          label="Security Settings"
          leading={<Ionicons name="shield-checkmark-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/security')}
        />
        <RealixListRow
          label="Delete Account"
          leading={<Ionicons name="trash-outline" size={18} color={RealixColors.danger} />}
          destructive
          onPress={() => router.push('/(tabs)/profile/delete-account')}
        />
      </RealixCard>

      <RealixSectionLabel>Other</RealixSectionLabel>
      <RealixCard>
        <RealixListRow
          label="FAQ"
          leading={<Ionicons name="help-circle-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/faq')}
        />
        <RealixListRow
          label="Privacy Policy"
          leading={<Ionicons name="document-text-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/privacy-policy')}
        />
        <RealixListRow
          label="Terms and Conditions"
          leading={<Ionicons name="document-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/terms-and-conditions')}
        />
        <RealixListRow
          label="More Info"
          leading={<Ionicons name="information-circle-outline" size={18} color={RealixColors.textSecondary} />}
          onPress={() => router.push('/(tabs)/profile/more-info')}
        />
      </RealixCard>

      <Text style={styles.meta}>These screens use local sample data so backend endpoints can be connected later without changing the route flow.</Text>

      <RealixCard>
        <RealixListRow
          label="Log out"
          leading={<Ionicons name="log-out-outline" size={18} color={RealixColors.danger} />}
          destructive
          trailing={<Ionicons name="chevron-forward" size={18} color={RealixColors.textCaption} />}
          onPress={() => {
            Alert.alert('Log out', 'Do you want to end your session?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => void handleLogout() },
            ]);
          }}
        />
      </RealixCard>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
  },
  profileCard: {
    padding: 18,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: RealixColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  profileTextWrap: {
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  profileEmail: {
    fontSize: 13,
    color: RealixColors.textMuted,
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
    color: RealixColors.textMuted,
    paddingHorizontal: 4,
  },
});