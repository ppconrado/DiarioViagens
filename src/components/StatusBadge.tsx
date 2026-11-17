import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PlaceStatus } from "@/src/types/place";
import { colors, fonts } from "@/src/theme/colors";

export function StatusBadge({ status, compact = false }: { status: PlaceStatus; compact?: boolean }) {
  const visited = status === "Visitado";
  const tint = visited ? colors.visited : colors.planned;
  return (
    <View style={[styles.badge, { borderColor: `${tint}55`, backgroundColor: `${tint}18` }, compact && styles.compact]}>
      <Ionicons name={visited ? "checkmark-circle" : "bookmark"} size={compact ? 12 : 14} color={tint} />
      <Text style={[styles.text, { color: tint }, compact && styles.compactText]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 30, paddingHorizontal: 11, paddingVertical: 7, flexDirection: "row", alignItems: "center", gap: 6 },
  compact: { paddingHorizontal: 9, paddingVertical: 5, gap: 4 },
  text: { fontFamily: fonts.medium, fontSize: 11 },
  compactText: { fontSize: 10 },
});
