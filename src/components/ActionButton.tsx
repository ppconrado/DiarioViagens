import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/src/theme/colors";

type IconName = ComponentProps<typeof Ionicons>["name"];
type ActionButtonProps = {
  title: string;
  onPress: () => void;
  icon?: IconName;
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export function ActionButton({ title, onPress, icon, variant = "primary", loading = false, disabled = false, compact = false }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.background : colors.primary} size="small" /> : null}
      {!loading && icon ? <Ionicons name={icon} size={18} color={variant === "primary" ? colors.background : variant === "danger" ? colors.danger : colors.primary} /> : null}
      <Text style={[styles.label, compact && styles.compactLabel, variant === "primary" && styles.primaryLabel, variant === "danger" && styles.dangerLabel]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, paddingHorizontal: 18, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  compact: { minHeight: 42, paddingHorizontal: 14, borderRadius: 14 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceRaised },
  outline: { borderWidth: 1, borderColor: colors.border, backgroundColor: "transparent" },
  danger: { borderWidth: 1, borderColor: "#633B4A", backgroundColor: "#2A2030" },
  label: { color: colors.text, fontFamily: fonts.semibold, fontSize: 13 },
  compactLabel: { fontSize: 12 },
  primaryLabel: { color: colors.background },
  dangerLabel: { color: colors.danger },
  disabled: { opacity: 0.48 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
});
