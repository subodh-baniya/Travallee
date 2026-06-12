import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button, PaginationDots } from "@/src/components/realix/ui";
import { Colors } from "@/src/constants/app/color";
import { Typography } from "@/src/constants/app/typography";
import { Spacing } from "@/src/constants/app/spacing";
import type { OnboardingSlide } from "@/src/constants/screens/onboarding";

const { width, height } = Dimensions.get("window");

interface OnboardingScreenProps {
  slide: OnboardingSlide;
  current: number;
  total: number;
  isLast?: boolean;
  onSkip?: () => void;
  onNext: () => void;
}

export default function OnboardingScreen({
  slide,
  current,
  total,
  isLast = false,
  onSkip,
  onNext,
}: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={{ uri: slide.imageUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.card}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>

          <PaginationDots total={total} current={current} style={styles.pagination} />

          {isLast ? (
            <Button title="Get Started" onPress={onNext} style={styles.getStartedButton} />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button
                title="Next"
                onPress={onNext}
                fullWidth={false}
                style={styles.nextButton}
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Spacing.borderRadius.xl,
    borderTopRightRadius: Spacing.borderRadius.xl,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    marginVertical: Spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
  nextButton: {
    paddingHorizontal: Spacing.xxl,
  },
  getStartedButton: {
    marginTop: Spacing.md,
  },
});
