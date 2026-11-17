import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme/colors";

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <View style={styles.row}>
      <Image source={require("../../assets/images/icon.png")} style={[styles.icon, small && styles.smallIcon]} />
      <View>
        <Text style={[styles.title, small && styles.smallTitle]}>DIÁRIO</Text>
        <Text style={styles.subtitle}>DE VIAGENS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 42, height: 42, borderRadius: 13 },
  smallIcon: { width: 30, height: 30, borderRadius: 9 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1.5 },
  smallTitle: { fontSize: 11 },
  subtitle: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 2.6, marginTop: 2 },
});
