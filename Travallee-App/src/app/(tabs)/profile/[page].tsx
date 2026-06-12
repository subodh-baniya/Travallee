import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  RealixCard,
  RealixHeader,
  RealixScreen,
} from '@/src/components/realix/screen-shell';
import { RealixColors } from '@/src/constants/screens/realix';

const pageCopy: Record<string, { title: string; body: string; icon: keyof typeof Ionicons.glyphMap }> = {
  history: {
    title: 'History',
    body: 'Recent bookings, viewed listings, and saved destinations can be surfaced here once those APIs are connected.',
    icon: 'time-outline',
  },
  security: {
    title: 'Security Settings',
    body: 'Password updates, device sessions, and verification settings belong here. This screen is ready for backend wiring.',
    icon: 'shield-checkmark-outline',
  },
  'delete-account': {
    title: 'Delete Account',
    body: 'Account deletion requires a confirmed destructive flow. The UI placeholder is in place so the route structure is complete.',
    icon: 'trash-outline',
  },
  'more-info': {
    title: 'More Information',
    body: `Welcome to Travallee - Your Hotel Booking Companion for Nepal\n\nABOUT TRAVALLEE\nTravallee is a mobile app designed to help travelers discover and book hotels across Nepal's most beautiful destinations including Kathmandu, Pokhara, Chitwan National Park, Nagarkot, and Bhaktapur.\n\nKEY FEATURES\n• Browse 100+ hotels across Nepal\n• Compare prices and amenities\n• Secure bookings with multiple payment options\n• Real-time availability updates\n• 24/7 customer support\n• Exclusive deals and discounts\n\nOUR MISSION\nTo make hotel booking in Nepal simple, transparent, and accessible to everyone.\n\nAPP INFORMATION\nTravallee v1.0.0 (April 2024)\nSupported on iOS and Android\n\nCONTACT US\nEmail: Kcprabin2063@gmail.com\n\nWe'd love to hear your feedback, suggestions, or if you have any issues. Reach out anytime!\n\nThank you for choosing Travallee for your hotel bookings in Nepal. Happy travels!`,
    icon: 'information-circle-outline',
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    body: `Last Updated: April 2024\n\nTravallee ("App") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information while booking hotels in Nepal.\n\nDATA WE COLLECT\n• Account info: Name, email, phone number, profile picture\n• Booking data: Hotel selections, dates, payment information\n• Location: GPS data for nearby hotel searches\n• Device info: Device type, OS version for app functionality\n• Usage analytics: How you interact with the app\n\nDATA PROTECTION\n• All payment data is encrypted using SSL/TLS\n• We never sell your personal information to third parties\n• Your browsing history is private and not shared\n• Payment details are processed by secure payment gateways\n\nCOOKIES & TRACKING\n• Optional analytics help us improve the app\n• You can disable tracking in settings anytime\n• Local data is stored on your device only\n\nCONTACT US\nFor privacy concerns, email: Kcprabin2063@gmail.com\n\nFor more details, visit our website or contact support directly.`,
    icon: 'document-text-outline',
  },
  'terms-and-conditions': {
    title: 'Terms and Conditions',
    body: `Last Updated: April 2024\n\nWelcome to Travallee! By using this app, you agree to these Terms. If you don't agree, please don't use the app.\n\nUSER RESPONSIBILITIES\n• You must be 18+ to book hotels\n• Provide accurate information during registration\n• Keep your password confidential\n• Use the app only for lawful purposes\n• Don't misuse hotel data or commit fraud\n\nHOTEL BOOKING POLICIES\n• Check-in time: 2:00 PM | Check-out time: 11:00 AM\n• Cancellations: Free up to 48 hours before check-in\n• Non-refundable rates: No refunds permitted after booking\n• Damage charges: You're liable for hotel property damage\n• House Rules: Follow each hotel's specific rules\n\nPAYMENT TERMS\n• Prices shown in Nepali Rupees (NPR)\n• Payment via eSewa, Khalti, Card, or Bank Transfer\n• No refunds for user cancellations after deadline\n• Taxes and fees are included in final price\n\nLIABILITY DISCLAIMER\n• Travallee isn't liable for hotel service issues\n• Disputes should be resolved directly with the hotel\n• App is provided "as-is" without warranties\n\nCONTACT & SUPPORT\nQuestions about these terms? Email: Kcprabin2063@gmail.com\n\nFor support: Use in-app chat feature or contact hotel directly.\n\nThank you for choosing Travallee!`,
    icon: 'document-outline',
  },
};

export default function ProfilePlaceholderPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const content = pageCopy[page] ?? {
    title: 'Coming Soon',
    body: 'This route has been scaffolded for the new profile experience.',
    icon: 'ellipse-outline',
  };

  return (
    <RealixScreen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <RealixHeader title={content.title} showBack />

      <RealixCard style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name={content.icon} size={34} color={RealixColors.textPrimary} />
        </View>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.body}>{content.body}</Text>
      </RealixCard>
    </RealixScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RealixColors.sectionBackground,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: RealixColors.textPrimary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: RealixColors.textSecondary,
    textAlign: 'left',
    letterSpacing: 0.3,
  },
});