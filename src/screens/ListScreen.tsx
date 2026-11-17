import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BrandMark } from "@/src/components/BrandMark";
import { PlaceCard } from "@/src/components/PlaceCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import { usePlaces } from "@/src/context/PlacesContext";
import { colors, fonts } from "@/src/theme/colors";
import type { RootStackParamList } from "@/src/navigation/types";

export default function ListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { places, isLoaded, storageError } = usePlaces();
  const summary = useMemo(() => ({ planned: places.filter((place) => place.status === "Quero visitar").length, visited: places.filter((place) => place.status === "Visitado").length }), [places]);

  return (
    <ScreenShell>
      <View style={styles.topRow}><BrandMark /><Pressable accessibilityRole="button" accessibilityLabel="Adicionar lugar" onPress={() => navigation.navigate("Cadastro")} style={styles.addIcon}><Ionicons name="add" size={23} color={colors.background} /></Pressable></View>
      {storageError ? <View accessibilityRole="alert" style={styles.storageWarning}><Ionicons name="alert-circle-outline" size={18} color={colors.danger} /><Text style={styles.storageWarningText}>{storageError}</Text></View> : null}
      <View style={styles.hero}>
        <View style={styles.orbit} /><Text style={styles.kicker}>SEU CADERNO DE ROTAS</Text>
        <Text style={styles.headline}>{places.length ? "O mundo está" : "Toda viagem"}{"\n"}<Text style={styles.headlineAccent}>{places.length ? "mais perto." : "começa com um lugar."}</Text></Text>
        <Text style={styles.subtitle}>{places.length ? "Guarde seus destinos e volte às memórias quando quiser." : "Guarde os destinos que moram nos seus planos e transforme cada visita em lembrança."}</Text>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Cadastro")} style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}><Ionicons name="add" size={19} color={colors.background} /><Text style={styles.heroButtonText}>Adicionar lugar</Text></Pressable>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{summary.planned}</Text><Text style={styles.summaryLabel}>na sua lista</Text><View style={[styles.summaryDot, { backgroundColor: colors.planned }]} /></View>
        <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{summary.visited}</Text><Text style={styles.summaryLabel}>já visitados</Text><View style={[styles.summaryDot, { backgroundColor: colors.visited }]} /></View>
      </View>
      <View style={styles.sectionHeader}><View><Text style={styles.sectionEyebrow}>COLEÇÃO</Text><Text style={styles.sectionTitle}>Seus lugares</Text></View><Text style={styles.count}>{places.length} {places.length === 1 ? "lugar" : "lugares"}</Text></View>
      {!isLoaded ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Abrindo seu diário…</Text></View> : places.length === 0 ? (
        <View style={styles.emptyCard}><View style={styles.emptyIcon}><Ionicons name="compass-outline" size={26} color={colors.primary} /></View><Text style={styles.emptyTitle}>Ainda não há destinos por aqui</Text><Text style={styles.emptyCopy}>Adicione um lugar que quer conhecer ou uma viagem que já virou história.</Text><Pressable accessibilityRole="button" onPress={() => navigation.navigate("Cadastro")} style={styles.emptyLink}><Text style={styles.emptyLinkText}>Começar meu diário</Text><Ionicons name="arrow-forward" size={15} color={colors.primary} /></Pressable></View>
      ) : (
        <View style={styles.list}>{places.map((place) => <PlaceCard key={place.id} place={place} onPress={() => navigation.navigate("Detalhes", { id: place.id })} />)}</View>
      )}
      <View style={styles.footer}><Ionicons name="sparkles-outline" size={14} color={colors.accent} /><Text style={styles.footerText}>Feito para lembrar — e para planejar a próxima.</Text></View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  hero: { padding: 24, minHeight: 252, borderRadius: 28, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, overflow: "hidden" },
  orbit: { position: "absolute", width: 190, height: 190, borderRadius: 100, borderWidth: 1, borderColor: "#2EC4B622", right: -58, top: -75 },
  kicker: { color: colors.primary, fontFamily: fonts.semibold, letterSpacing: 2.2, fontSize: 9, marginBottom: 14 },
  headline: { color: colors.text, fontFamily: fonts.bold, fontSize: 27, lineHeight: 35 },
  headlineAccent: { color: colors.primary },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 18, maxWidth: 290, marginTop: 10 },
  heroButton: { alignSelf: "flex-start", marginTop: 18, paddingHorizontal: 16, minHeight: 43, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, backgroundColor: colors.primary },
  heroButtonText: { color: colors.background, fontFamily: fonts.semibold, fontSize: 11 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { flex: 1, minHeight: 82, backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 13, justifyContent: "center" },
  summaryNumber: { color: colors.text, fontFamily: fonts.bold, fontSize: 21 },
  summaryLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, marginTop: 2 },
  summaryDot: { position: "absolute", width: 7, height: 7, borderRadius: 5, right: 14, top: 17 },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 2 },
  sectionEyebrow: { color: colors.subtle, fontFamily: fonts.semibold, fontSize: 9, letterSpacing: 2 },
  sectionTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 18, marginTop: 4 },
  count: { color: colors.muted, fontFamily: fonts.medium, fontSize: 10, paddingBottom: 3 },
  loading: { minHeight: 130, alignItems: "center", justifyContent: "center", gap: 10 },
  loadingText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11 },
  emptyCard: { padding: 22, alignItems: "flex-start", borderRadius: 23, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  emptyIcon: { width: 48, height: 48, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#2EC4B61A", marginBottom: 14 },
  emptyTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
  emptyCopy: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 18, marginTop: 7 },
  emptyLink: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 17 },
  emptyLinkText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 11 },
  list: { gap: 11 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingTop: 8 },
  footerText: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9 },
  pressed: { opacity: 0.83 },
  storageWarning: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 13, borderRadius: 15, backgroundColor: "#EF777718", borderColor: "#EF777744", borderWidth: 1 },
  storageWarningText: { flex: 1, color: colors.danger, fontFamily: fonts.medium, fontSize: 10, lineHeight: 16 },
});
