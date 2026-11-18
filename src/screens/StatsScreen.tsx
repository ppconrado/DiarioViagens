import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Circle, Svg } from "react-native-svg";
import { ScreenShell } from "@/src/components/ScreenShell";
import { usePlaces } from "@/src/context/PlacesContext";
import { colors, fonts } from "@/src/theme/colors";
import type { PlaceStatus } from "@/src/types/place";

const statusColors: Record<PlaceStatus, string> = { "Quero visitar": colors.accent, Visitado: colors.primary };

export default function StatsScreen() {
  const { places } = usePlaces();
  const stats = useMemo(() => {
    const byStatus: Record<PlaceStatus, number> = { "Quero visitar": 0, Visitado: 0 };
    const byCity = new Map<string, number>();
    places.forEach((place) => {
      byStatus[place.status] += 1;
      const label = `${place.city} · ${place.state}`;
      byCity.set(label, (byCity.get(label) ?? 0) + 1);
    });
    return { byStatus, byCity: [...byCity.entries()].sort((a, b) => b[1] - a[1]) };
  }, [places]);

  const cityData = useMemo(() => stats.byCity, [stats]);
  const plannedShare = places.length ? stats.byStatus["Quero visitar"] / places.length : 0;
  const visitedShare = places.length ? stats.byStatus.Visitado / places.length : 0;
  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <ScreenShell>
      <View style={styles.header}><Text style={styles.eyebrow}>UM RETRATO DA SUA JORNADA</Text><Text style={styles.title}>Estatísticas</Text><Text style={styles.subtitle}>Os números mudam junto com cada lugar do seu diário.</Text></View>
      <View style={styles.totalCard}><View style={styles.totalIcon}><Ionicons name="analytics-outline" size={21} color={colors.primary} /></View><View style={styles.totalCopy}><Text style={styles.totalLabel}>LUGARES NO DIÁRIO</Text><Text style={styles.totalValue}>{places.length}</Text></View><View style={styles.totalBadge}><Text style={styles.totalBadgeText}>{places.length ? "ATUALIZADO" : "PRONTO"}</Text></View></View>

      <View style={styles.chartCard}>
        <View style={styles.cardHeading}><View><Text style={styles.cardEyebrow}>STATUS</Text><Text style={styles.cardTitle}>O que vem pela frente?</Text></View><Ionicons name="pie-chart-outline" size={19} color={colors.primary} /></View>
        {places.length ? (
          <View style={styles.pieRow}>
            <View style={styles.pie}>
              <Svg width={148} height={148} viewBox="0 0 148 148">
                <Circle cx={74} cy={74} r={ringRadius} fill="none" stroke={colors.surfaceRaised} strokeWidth={18} />
                {plannedShare > 0 ? (
                  <Circle cx={74} cy={74} r={ringRadius} fill="none" stroke={colors.accent} strokeWidth={18} strokeLinecap="butt" strokeDasharray={`${ringCircumference * plannedShare} ${ringCircumference}`} transform="rotate(-90 74 74)" />
                ) : null}
                {visitedShare > 0 ? (
                  <Circle cx={74} cy={74} r={ringRadius} fill="none" stroke={colors.primary} strokeWidth={18} strokeLinecap="butt" strokeDasharray={`${ringCircumference * visitedShare} ${ringCircumference}`} strokeDashoffset={-ringCircumference * plannedShare} transform="rotate(-90 74 74)" />
                ) : null}
              </Svg>
              <View style={styles.pieCenter}><Text style={styles.pieValue}>{places.length}</Text><Text style={styles.pieLabel}>lugares</Text></View>
            </View>
            <View style={styles.legend}>
              {(["Quero visitar", "Visitado"] as PlaceStatus[]).map((status) => (
                <View key={status} style={styles.legendLine}><View style={[styles.legendDot, { backgroundColor: statusColors[status] }]} /><View style={styles.legendCopy}><Text style={styles.legendLabel}>{status}</Text><Text style={styles.legendValue}>{stats.byStatus[status]} {stats.byStatus[status] === 1 ? "lugar" : "lugares"}</Text></View></View>
              ))}
              <Text style={styles.share}>{places.length} no total</Text>
            </View>
          </View>
        ) : <EmptyChart message="Adicione um lugar para ver como seus planos e visitas se distribuem." />}
      </View>

      <View style={styles.chartCard}>
        <View style={styles.cardHeading}><View><Text style={styles.cardEyebrow}>DESTINOS</Text><Text style={styles.cardTitle}>Lugares por cidade</Text></View><Ionicons name="bar-chart-outline" size={19} color={colors.primary} /></View>
        {cityData.length ? (
          <>
            <View style={styles.cityBars}>{cityData.slice(0, 6).map(([label, value], index) => {
              const maxValue = cityData[0][1];
              return (
                <View key={label} style={styles.cityBarRow}>
                  <View style={styles.cityBarHeading}><Text style={styles.cityName} numberOfLines={1}>{label}</Text><Text style={styles.cityCount}>{value}</Text></View>
                  <View style={styles.cityBarTrack}><View style={[styles.cityBarFill, { width: `${Math.max((value / maxValue) * 100, 8)}%`, backgroundColor: [colors.primary, colors.accent, "#7999E8", "#D98CC1", "#70C9A0", "#EE8D62"][index] }]} /></View>
                </View>
              );
            })}</View>
          </>
        ) : <EmptyChart message="As cidades aparecem aqui quando você cadastrar seus destinos." />}
      </View>
      <Text style={styles.footnote}>Gráficos calculados com os lugares cadastrados neste dispositivo.</Text>
    </ScreenShell>
  );
}

function EmptyChart({ message }: { message: string }) {
  return <View style={styles.empty}><Ionicons name="stats-chart-outline" size={23} color={colors.subtle} /><Text style={styles.emptyText}>{message}</Text></View>;
}

const styles = StyleSheet.create({
  header: { gap: 7, marginBottom: 2 },
  eyebrow: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 1.8 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 26 },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 17, maxWidth: 300 },
  totalCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  totalIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#2EC4B61A", alignItems: "center", justifyContent: "center" },
  totalCopy: { marginLeft: 12, flex: 1 },
  totalLabel: { color: colors.subtle, fontFamily: fonts.semibold, letterSpacing: 1.3, fontSize: 8 },
  totalValue: { color: colors.text, fontFamily: fonts.bold, fontSize: 22, marginTop: 2 },
  totalBadge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: colors.surfaceRaised },
  totalBadgeText: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 0.7 },
  chartCard: { padding: 17, borderRadius: 23, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, gap: 18 },
  cardHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardEyebrow: { color: colors.subtle, fontFamily: fonts.semibold, letterSpacing: 1.6, fontSize: 8 },
  cardTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14, marginTop: 5 },
  pieRow: { minHeight: 156, flexDirection: "row", alignItems: "center", gap: 12 },
  pie: { width: 148, height: 148, alignItems: "center", justifyContent: "center" },
  pieCenter: { position: "absolute", alignItems: "center" },
  pieValue: { color: colors.text, fontFamily: fonts.bold, fontSize: 21 },
  pieLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: 9, marginTop: 2 },
  legend: { flex: 1, gap: 14 },
  legendLine: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  legendDot: { width: 9, height: 9, borderRadius: 6, marginTop: 3 },
  legendCopy: { flex: 1 },
  legendLabel: { color: colors.text, fontFamily: fonts.medium, fontSize: 10 },
  legendValue: { color: colors.muted, fontFamily: fonts.regular, fontSize: 9, marginTop: 4 },
  share: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9 },
  cityBars: { gap: 11 },
  cityBarRow: { gap: 6 },
  cityBarHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cityName: { color: colors.muted, fontFamily: fonts.medium, fontSize: 9, flex: 1 },
  cityCount: { color: colors.text, fontFamily: fonts.semibold, fontSize: 10, marginLeft: 12 },
  cityBarTrack: { height: 8, borderRadius: 5, overflow: "hidden", backgroundColor: colors.surfaceRaised },
  cityBarFill: { height: "100%", borderRadius: 5 },
  empty: { minHeight: 136, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 26 },
  emptyText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, textAlign: "center", lineHeight: 16 },
  footnote: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9, textAlign: "center", marginTop: -5 },
});
