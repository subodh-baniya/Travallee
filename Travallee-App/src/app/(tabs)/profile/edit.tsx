import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Modal,
} from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {
  RealixCard,
  RealixHeader,
  RealixScreen,
} from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';
import { API_ENDPOINTS_AUTH } from '@/src/constants/api';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const initials = useMemo(() => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join('');
  }, [name]);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(API_ENDPOINTS_AUTH.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success && response.data.data) {
          const userData = response.data.data;
          setName(userData.Name || '');
          setEmail(userData.email || '');
          setNumber(userData.number || '');
          
          // Fetch profile image
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      } catch (err: any) {
        console.error('Failed to load profile details', err.message);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle take photo from camera
  const handleTakePhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setShowPhotoModal(false);
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  }, []);

  // Handle pick image from gallery
  const handlePickImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Gallery permission is required to pick a photo');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setShowPhotoModal(false);
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (err: any) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  }, []);

  // Handle upload photo to backend
  const uploadPhoto = useCallback(async (photoUri: string) => {
    try {
      setUploadingPhoto(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'profile-photo.jpg',
      } as any);

      const response = await axios.post(
        API_ENDPOINTS_AUTH.UPDATE_PROFILE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setProfileImage(photoUri);
        Alert.alert('Success', 'Profile photo updated successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update photo');
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload photo';
      Alert.alert('Error', errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  // Handle save profile changes
  const handleSaveChanges = useCallback(async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Name and email are required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const updateData = {
        Name: name.trim(),
        email: email.trim(),
        ...(number.trim() && { number: number.trim() }),
      };

      const response = await axios.post(
        API_ENDPOINTS_AUTH.UPDATE_PROFILE,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [name, email, number, router]);

  if (loading) {
    return (
      <RealixScreen contentContainerStyle={styles.content}>
        <RealixHeader title="Edit Profile" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={RealixColors.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </RealixScreen>
    );
  }

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title="Edit Profile" showBack />

      <RealixCard style={styles.card}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials || 'U'}</Text>
              </View>
            )}
            <Pressable
              style={styles.avatarBadge}
              onPress={() => setShowPhotoModal(true)}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? (
                <ActivityIndicator color="#ffffff" size={14} />
              ) : (
                <Ionicons name="camera-outline" size={14} color="#ffffff" />
              )}
            </Pressable>
          </View>
          <Text style={styles.name}>{name || 'User'}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.photoHint}>Tap the camera icon to change photo</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color={RealixColors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={RealixColors.textMuted}
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={RealixColors.textMuted}
            editable={!saving}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={number}
            onChangeText={setNumber}
            keyboardType="phone-pad"
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={RealixColors.textMuted}
            editable={!saving}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
            saving && styles.disabledButton,
          ]}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <>
              <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Saving...</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </RealixCard>

      {/* Photo Edit Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Photo</Text>
              <Pressable onPress={() => setShowPhotoModal(false)}>
                <Ionicons name="close" size={24} color={RealixColors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalOptions}>
              <Pressable
                style={styles.modalOption}
                onPress={handleTakePhoto}
                disabled={uploadingPhoto}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="camera" size={28} color={RealixColors.accent} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Take a Photo</Text>
                  <Text style={styles.optionDescription}>Use your camera to take a new photo</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.modalOption}
                onPress={handlePickImage}
                disabled={uploadingPhoto}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="images" size={28} color={RealixColors.accent} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Pick from Gallery</Text>
                  <Text style={styles.optionDescription}>Select a photo from your gallery</Text>
                </View>
              </Pressable>
            </View>

            {uploadingPhoto && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color={RealixColors.accent} />
                <Text style={styles.uploadingText}>Uploading photo...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: RealixColors.textSecondary,
  },
  card: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    backgroundColor: RealixColors.cardBackground,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrap: {
    marginBottom: 10,
    position: 'relative',
  },
  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: RealixColors.accent,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RealixColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: RealixColors.cardBackground,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: RealixColors.textMuted,
  },
  photoHint: {
    marginTop: 8,
    fontSize: 11,
    color: RealixColors.textCaption,
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: RealixColors.danger,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: RealixColors.textCaption,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
    backgroundColor: RealixColors.inputBackground,
    paddingHorizontal: 14,
    fontSize: 15,
    color: RealixColors.textPrimary,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  passwordWrap: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: 6,
    minHeight: 54,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RealixColors.accent,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  pressed: {
    opacity: 0.8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: RealixColors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  modalOptions: {
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: RealixColors.rowBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RealixColors.inputBorder,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(126, 211, 33, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: RealixColors.textMuted,
  },
  uploadingContainer: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 13,
    color: RealixColors.textSecondary,
  },
});