import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import OnboardingScreen from "@/src/components/onboarding/onboarding-screen";
import {
  ONBOARDING_SLIDES,
  type OnboardingSlide,
} from "@/src/constants/screens/onboarding";
import { getOnboardingSlides } from "@/src/services/onboarding.service";

export default function OnboardingFlowScreen() {
  const router = useRouter();
  const [slides, setSlides] = useState<OnboardingSlide[]>(ONBOARDING_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      const remoteSlides = await getOnboardingSlides();
      if (isMounted && remoteSlides.length > 0) {
        setSlides(remoteSlides);
      }
    };

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const safeMax = Math.max(0, slides.length - 1);
    if (currentIndex > safeMax) {
      setCurrentIndex(safeMax);
    }
  }, [slides.length, currentIndex]);

  const currentSlide = slides[currentIndex] || ONBOARDING_SLIDES[currentIndex] || ONBOARDING_SLIDES[0];
  const isLast = currentIndex >= slides.length - 1;

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(auth)/signin" as any);
  };

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(auth)/signin" as any);
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  return (
    <OnboardingScreen
      slide={currentSlide}
      current={currentIndex}
      total={slides.length}
      isLast={isLast}
      onSkip={handleSkip}
      onNext={handleNext}
    />
  );
}
