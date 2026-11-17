import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-svg-charts";
import { Ionicons } from "@expo/vector-icons";
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

  const pieData = useMemo(() => ([
    { key: "planned", label: "Quero visitar", value: stats.byStatus["Quero visitar"], svg: { fill: colors.accent } },
    { key: "visited", label: "Visitado", value: stats.byStatus.Visitado, svg: { fill: colors.primary } },
  ].filter((item) => item.value > 0)), [stats]);

  const cityData = useMemo(() => stats.byCity.map(([label, value], index) => ({
    label,
    value,
    svg: { fill: [colors.primary, colors.accent, "#7999E8", "#D98CC1", "#70C9A0", "#EE8D62"][index % 6] },
  })), [stats]);

  return (
    <ScreenShell>
      <View style={styles.header}><Text style={styles.eyebrow}>UM RETRATO DA SUA JORNADA</Text><Text style={styles.title}>Estatísticas</Text><Text style={styles.subtitle}>Os números mudam junto com cada lugar do seu diário.</Text></View>
      <View style={styles.totalCard}><View style={styles.totalIcon}><Ionicons name="analytics-outline" size={21} color={colors.primary} /></View><View style={styles.totalCopy}><Text style={styles.totalLabel}>LUGARES NO DIÁRIO</Text><Text style={styles.totalValue}>{places.length}</Text></View><View style={styles.totalBadge}><Text style={styles.totalBadgeText}>{places.length ? "ATUALIZADO" : "PRONTO"}</Text></View></View>

      <View style={styles.chartCard}>
        <View style={styles.cardHeading}><View><Text style={styles.cardEyebrow}>STATUS</Text><Text style={styles.cardTitle}>O que vem pela frente?</Text></View><Ionicons name="pie-chart-outline" size={19} color={colors.primary} /></View>
        {places.length ? (
          <View style={styles.pieRow}>
            <PieChart style={styles.pie} data={pieData} valueAccessor={({ item }) => item.value} innerRadius="62%" outerRadius="88%" padAngle={0.025} />
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
            <BarChart style={styles.bars} data={cityData} yAccessor={({ item }) => item.value} contentInset={{ top: 14, bottom: 10 }} gridMin={0} spacingInner={0.35} svg={{ fill: colors.primary }} />
            <View style={styles.cityRows}>{cityData.map((city) => <View key={city.label} style={styles.cityRow}><Text style={styles.cityName} numberOfLines={1}>{city.label}</Text><Text style={styles.cityCount}>{city.value}</Text></View>)}</View>
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
  pie: { width: 148, height: 148 },
  legend: { flex: 1, gap: 14 },
  legendLine: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  legendDot: { width: 9, height: 9, borderRadius: 6, marginTop: 3 },
  legendCopy: { flex: 1 },
  legendLabel: { color: colors.text, fontFamily: fonts.medium, fontSize: 10 },
  legendValue: { color: colors.muted, fontFamily: fonts.regular, fontSize: 9, marginTop: 4 },
  share: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9 },
  bars: { height: 166 },
  cityRows: { gap: 8 },
  cityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  cityName: { color: colors.muted, fontFamily: fonts.medium, fontSize: 9, flex: 1 },
  cityCount: { color: colors.text, fontFamily: fonts.semibold, fontSize: 10, marginLeft: 12 },
  empty: { minHeight: 136, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 26 },
  emptyText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, textAlign: "center", lineHeight: 16 },
  footnote: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9, textAlign: "center", marginTop: -5 },
});
