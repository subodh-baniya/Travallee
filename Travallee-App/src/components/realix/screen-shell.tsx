import React, { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';

type RealixScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

type RealixHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
};

type RealixListRowProps = {
  label: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  titleStyle?: StyleProp<TextStyle>;
};

export function RealixScreen({
  children,
  scrollable = true,
  contentContainerStyle,
  style,
}: RealixScreenProps) {
  if (!scrollable) {
    return (
      <SafeAreaView style={[styles.screen, style]} edges={['top']}>
        <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, style]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function RealixHeader({ title, showBack, onBack, rightSlot }: RealixHeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const canGoBack = navigation?.canGoBack?.() ?? false;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {showBack && canGoBack ? (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={20} color={RealixColors.textPrimary} />
          </Pressable>
        ) : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {rightSlot ? <View style={styles.headerRight}>{rightSlot}</View> : <View style={styles.headerSpacer} />}
    </View>
  );
}

export function RealixSectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function RealixCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function RealixListRow({
  label,
  leading,
  trailing,
  onPress,
  destructive,
  titleStyle,
}: RealixListRowProps) {
  const content = (
    <>
      <View style={styles.rowLeft}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <Text style={[styles.rowLabel, destructive && styles.rowLabelDanger, titleStyle]}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {trailing ?? <Ionicons name="chevron-forward" size={18} color={RealixColors.textCaption} />}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: RealixColors.pageBackground,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 18,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: RealixColors.textPrimary,
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  headerSpacer: {
    width: 40,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RealixColors.screenBackground,
    borderWidth: 1,
    borderColor: RealixColors.border,
  },
  pressed: {
    opacity: 0.72,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: RealixColors.textMuted,
    marginBottom: -8,
  },
  card: {
    backgroundColor: RealixColors.screenBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: RealixColors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 3,
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: RealixColors.border,
  },
  rowPressed: {
    backgroundColor: RealixColors.rowBackground,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leading: {
    width: 20,
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: RealixColors.textPrimary,
  },
  rowLabelDanger: {
    color: RealixColors.danger,
  },
  rowRight: {
    marginLeft: 12,
  },
});