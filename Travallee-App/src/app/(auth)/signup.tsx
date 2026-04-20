import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  Input,
  SocialButton,
  Divider,
  Checkbox,
  FormFeedback,
} from "@/src/components/realix/ui";
import { Colors } from "@/src/constants/app/color";
import { Typography } from "@/src/constants/app/typography";
import { Spacing } from "@/src/constants/app/spacing";

import registerSchema from "@/src/schema/registerschema";
import { API_ENDPOINTS_AUTH } from "@/src/constants/api";
import axios from "axios";

export default function SignUp() {
  const API_SIGNUP = API_ENDPOINTS_AUTH.REGISTER;
  const API_SEND_VERIFICATION = API_ENDPOINTS_AUTH.SEND_OTP;
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleSignUp = async () => {
    if (!agreeToTerms) {
      setErrorMessage("Please accept Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const data: registerSchema = {
        Name: name.trim(),
        Username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      if (!data.Name || !data.Username || !data.email || !data.password) {
        setErrorMessage("Please fill out all required fields.");
        setLoading(false);
        return;
      }

      console.log("📝 Attempting registration...");
      const response = await axios.post(API_SIGNUP, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      console.log("✅ Registration successful");

      if (response.status === 201) {
        console.log("📧 Sending OTP...");
        try {
          await axios.post(
            API_SEND_VERIFICATION,
            { email: data.email },
            { 
              withCredentials: true, 
              headers: { "Content-Type": "application/json" },
              timeout: 15000,
            }
          );
          console.log("✅ OTP sent successfully");
        } catch (otpError: any) {
          console.warn("⚠️ OTP send failed, but continuing:", otpError.message);
        }
        
        console.log("🚀 Navigating to verification...");
        proceedToVerification();
      } else {
        setErrorMessage(response.data?.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      let msg = "Signup failed";
      
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

  const proceedToVerification = () => {
    try {
      router.push({
        pathname: "/(auth)/verify-code",
        params: { email: email.trim() },
      } as any);
    } catch (navError: any) {
      console.error("❌ Navigation error:", navError);
      setErrorMessage("Failed to navigate. Please try again.");
    }
  };

  const handleSignIn = () => {
    router.push("/(auth)/signin" as any);
  };

  const handlePhoneTab = () => {
    router.replace("/(auth)/signup-phone" as any);
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up");
  };

  const handleFacebookSignUp = () => {
    console.log("Facebook Sign Up");

  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={handlePhoneTab}>
            <Text style={styles.tabText}>Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create your account to get started
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <FormFeedback
            message={errorMessage}
            type="error"
            style={styles.feedback}
            onDismiss={() => setErrorMessage("")}
          />

          <Input
            placeholder="Name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="words"
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Username"
            value={username}
            onChangeText={(value) => {
              setUsername(value);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Email address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errorMessage) setErrorMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errorMessage) setErrorMessage("");
            }}
            isPassword
            containerStyle={styles.inputContainer}
          />

          {/* Terms Checkbox */}
          <Checkbox
            checked={agreeToTerms}
            onToggle={() => {
              setAgreeToTerms(!agreeToTerms);
              if (errorMessage) setErrorMessage("");
            }}
            labelComponent={
              <Text style={styles.termsText}>
                I agree to{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            }
            style={styles.checkbox}
          />

          <Button
            title="Continue"
            onPress={handleSignUp}
            loading={loading}
            disabled={!name || !email || !password}
            style={styles.continueButton}
          />
        </View>

        {/* Social SignUp */}
        <Divider text="Or Sign Up with" style={styles.divider} />

        <View style={styles.socialButtons}>
          <SocialButton provider="google" onPress={handleGoogleSignUp} />
          <SocialButton provider="facebook" onPress={handleFacebookSignUp} />
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackground,
    borderRadius: Spacing.borderRadius.md,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: Spacing.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.buttonText,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.xs,
  },
  feedback: {
    marginBottom: Spacing.sm,
  },
  checkbox: {
    marginTop: Spacing.sm,
  },
  termsText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
  },
  continueButton: {
    marginTop: Spacing.md,
  },
  divider: {
    marginVertical: Spacing.lg,
  },
  socialButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
});
