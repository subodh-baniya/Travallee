import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, NumberPad, FormFeedback } from "@/src/components/realix/ui";
import { Colors } from "@/src/constants/app/color";
import { Typography } from "@/src/constants/app/typography";
import { Spacing } from "@/src/constants/app/spacing";

import { API_ENDPOINTS_AUTH } from "@/src/constants/api";
import axios from "axios";

const OTP_LENGTH = 4;

export default function VerifyCode() {
  const API_VERIFY_OTP = API_ENDPOINTS_AUTH.VERIFY_OTP;
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : null;
  const phone = typeof params.phone === "string" ? params.phone : null;
  const contact = email || phone;

  const handleNumberPress = (value: string) => {
    if (otp.length < OTP_LENGTH) {
      if (errorMessage) setErrorMessage("");
      setOtp((prev) => prev + value);
    }
  };

  const handleBackspace = () => {
    if (errorMessage) setErrorMessage("");
    setOtp((prev) => prev.slice(0, -1));
  };

  const handleContinue = async () => {
    if (!contact) {
      setErrorMessage("Missing contact details. Please try signing in again.");
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      setErrorMessage("Please enter the 4-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      console.log("🔐 Verifying OTP...");
      const payload = email ? { email, otp } : { phone, otp };
      const response = await axios.post(API_VERIFY_OTP, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      console.log("✅ OTP verified successfully");

      if (response.status === 200) {
        console.log("🚀 Navigating to success page...");
        router.push("/(auth)/success" as any);
      } else {
        setErrorMessage(
          response.data?.message || "Invalid verification code. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("❌ Verification error:", error);
      let msg = "OTP verification failed. Please try again.";
      
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.code === "ECONNABORTED") {
        msg = "Request timeout. Please check your connection.";
      } else if (error.message) {
        msg = error.message;
      }
      
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>
            We have sent a verification code to{" "}
            <Text style={styles.phoneNumber}>{contact || "your account"}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                otp[index] && styles.otpBoxFilled,
                index === otp.length && styles.otpBoxActive,
              ]}
            >
              {otp[index] ? <Text style={styles.otpDot}>•</Text> : null}
            </View>
          ))}
        </View>

        <FormFeedback
          message={errorMessage}
          type="error"
          style={styles.feedback}
          onDismiss={() => setErrorMessage("")}
        />

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isComplete || !contact}
          loading={loading}
          style={styles.continueButton}
        />
      </View>

      {/* Custom Number Pad */}
      <View style={styles.numpadContainer}>
        <NumberPad
          onPress={handleNumberPress}
          onBackspace={handleBackspace}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  phoneNumber: {
    color: Colors.primary,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  otpBox: {
    width: Spacing.otpBoxSize,
    height: Spacing.otpBoxSize,
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxActive: {
    borderColor: Colors.primary,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
  },
  otpDot: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  continueButton: {
    marginTop: Spacing.md,
  },
  feedback: {
    marginTop: Spacing.sm,
  },
  numpadContainer: {
    paddingBottom: Spacing.xl,
  },
});
