import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapSurface from "@/src/components/MapSurface.native";
import { ScreenShell } from "@/src/components/ScreenShell";
import { usePlaces } from "@/src/context/PlacesContext";
import { useLocation } from "@/src/hooks/useLocation";
import { colors, fonts } from "@/src/theme/colors";
import type { RootStackParamList } from "@/src/navigation/navigation-types";

export default function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { places } = usePlaces();
  const { location, loading, permissionDenied, errorMessage, refreshLocation } = useLocation();

  return (
    <ScreenShell contentContainerStyle={styles.shell}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>CADA PONTO CONTA UMA HISTÓRIA</Text><Text style={styles.title}>Seu mapa</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Atualizar localização" onPress={() => void refreshLocation()} style={styles.refresh}><Ionicons name="locate-outline" size={20} color={colors.primary} /></Pressable>
      </View>
      <Text style={styles.description}>Uma visão de todos os lugares que você guarda no diário.</Text>
      {permissionDenied ? <View style={styles.notice}><Ionicons name="location-outline" size={17} color={colors.accent} /><Text style={styles.noticeText}>A localização foi negada. Os lugares salvos continuam visíveis; permita o acesso para mostrar onde você está.</Text></View> : null}
      {errorMessage ? <View style={styles.notice}><Ionicons name="alert-circle-outline" size={17} color={colors.accent} /><Text style={styles.noticeText}>{errorMessage}</Text></View> : null}
      <View style={styles.mapWrap}><MapSurface places={places} currentLocation={location} onSelectPlace={(id) => navigation.navigate("Detalhes", { id })} /></View>
      <View style={styles.legendRow}>
        <View style={styles.legend}><View style={[styles.dot, { backgroundColor: colors.planned }]} /><Text style={styles.legendText}>Quero visitar</Text></View>
        <View style={styles.legend}><View style={[styles.dot, { backgroundColor: colors.visited }]} /><Text style={styles.legendText}>Visitado</Text></View>
        {loading ? <View style={styles.locating}><ActivityIndicator size="small" color={colors.primary} /><Text style={styles.legendText}>Localizando…</Text></View> : null}
      </View>
      <Text style={styles.mapFootnote}>{places.length} {places.length === 1 ? "marcador de lugar" : "marcadores de lugares"} · toque em um marcador para ver detalhes</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingBottom: 14, gap: 12 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 1.6 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 25, marginTop: 5 },
  description: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 17 },
  refresh: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  mapWrap: { flex: 1, minHeight: 340 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 18, paddingTop: 2 },
  legend: { flexDirection: "row", alignItems: "center", gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 5 },
  legendText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 9 },
  locating: { flexDirection: "row", alignItems: "center", gap: 7, marginLeft: "auto" },
  notice: { flexDirection: "row", gap: 9, alignItems: "center", padding: 12, borderRadius: 16, backgroundColor: "#F4B94218", borderColor: "#F4B94244", borderWidth: 1 },
  noticeText: { flex: 1, color: colors.muted, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16 },
  mapFootnote: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9 },
});
