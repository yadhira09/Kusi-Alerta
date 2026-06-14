import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/theme";

export function AppButton({ children, onPress, variant = "primary", disabled = false, accessibilityLabel, accessibilityHint }: { children: ReactNode; onPress: () => void; variant?: "primary" | "secondary" | "danger"; disabled?: boolean; accessibilityLabel: string; accessibilityHint?: string }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.button, styles[variant], disabled && styles.disabled, pressed && !disabled && styles.pressed]}
    >
      <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, alignItems: "center", justifyContent: "center", marginVertical: 6 },
  primary: { backgroundColor: colors.blue900 },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200 },
  danger: { backgroundColor: colors.red700 },
  disabled: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.99 }] },
  text: { color: colors.white, fontWeight: "900", fontSize: 16, textAlign: "center" },
  secondaryText: { color: colors.blue900 }
});
