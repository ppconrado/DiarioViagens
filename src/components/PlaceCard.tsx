import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Place } from "@/src/types/place";
import { colors, fonts } from "@/src/theme/colors";
import { StatusBadge } from "@/src/components/StatusBadge";
import { PhotoAssetImage } from "@/src/components/PhotoAssetImage";

export function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {place.photoAssetId || place.photoUri ? (
        <PhotoAssetImage assetId={place.photoAssetId} legacyUri={place.photoUri} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}><Ionicons name="image-outline" size={24} color={colors.subtle} /></View>
      )}
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
        <View style={styles.cityRow}><Ionicons name="location-outline" size={14} color={colors.muted} /><Text style={styles.city} numberOfLines={1}>{place.city}, {place.state}</Text></View>
        <StatusBadge status={place.status} compact />
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 112, padding: 12, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 14 },
  photo: { width: 82, height: 82, borderRadius: 16, backgroundColor: colors.surfaceRaised },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, alignItems: "flex-start", gap: 7 },
  name: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  city: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
});
