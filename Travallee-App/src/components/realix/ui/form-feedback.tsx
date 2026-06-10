import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../../constants/app/color";
import { Spacing } from "../../../constants/app/spacing";
import { Typography } from "../../../constants/app/typography";

interface FormFeedbackProps {
  message: string;
  type?: "error" | "success" | "info";
  style?: ViewStyle;
  onDismiss?: () => void;
}

export const FormFeedback: React.FC<FormFeedbackProps> = ({
  message,
  type = "error",
  style,
  onDismiss,
}) => {
  if (!message) return null;

  const containerStyle = [
    styles.base,
    type === "error" && styles.error,
    type === "success" && styles.success,
    type === "info" && styles.info,
    style,
  ];

  const textStyle = [
    styles.text,
    type === "error" && styles.errorText,
    type === "success" && styles.successText,
    type === "info" && styles.infoText,
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{message}</Text>
      {onDismiss ? (
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Text style={styles.dismiss}>x</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  text: {
    ...Typography.bodySmall,
    flex: 1,
  },
  dismiss: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  error: {
    backgroundColor: "rgba(255, 82, 82, 0.12)",
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
  },
  success: {
    backgroundColor: "rgba(0, 230, 118, 0.12)",
    borderColor: Colors.success,
  },
  successText: {
    color: Colors.success,
  },
  info: {
    backgroundColor: "rgba(255, 214, 0, 0.12)",
    borderColor: Colors.warning,
  },
  infoText: {
    color: Colors.warning,
  },
});

export default FormFeedback;