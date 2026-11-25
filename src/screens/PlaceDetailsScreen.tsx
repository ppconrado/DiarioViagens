import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import MapSurface from "@/src/components/MapSurface.native";
import { ActionButton } from "@/src/components/ActionButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { StatusBadge } from "@/src/components/StatusBadge";
import { usePlaces } from "@/src/context/PlacesContext";
import { fullAddress } from "@/src/types/place";
import { colors, fonts } from "@/src/theme/colors";
import type { RootStackParamList } from "@/src/navigation/navigation-types";

export default function PlaceDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Detalhes">>();
  const id = route.params.id;
  const { findPlace, updateStatus, removePlace } = usePlaces();
  const place = findPlace(id);
  const showActionError = (message: string) => {
    Alert.alert("Não foi possível concluir", message);
  };

  const handleRemove = async () => {
    if (!place) return;
    const remove = async () => {
      try {
        await removePlace(place.id);
        navigation.replace("MainTabs");
      } catch (error) {
        showActionError(error instanceof Error ? error.message : "Não foi possível remover o lugar. Tente novamente.");
      }
    };
    Alert.alert("Remover lugar?", `“${place.name}” será apagado do diário.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => { void remove(); } },
    ]);
  };

  if (!place) return <ScreenShell><Text style={styles.title}>Lugar não encontrado</Text><ActionButton title="Voltar à lista" icon="arrow-back" onPress={() => navigation.replace("MainTabs")} variant="outline" /></ScreenShell>;
  const markVisited = async () => {
    try {
      await updateStatus(place.id, "Visitado");
    } catch (error) {
      showActionError(error instanceof Error ? error.message : "Não foi possível atualizar o status. Tente novamente.");
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.shell}>
      <View style={styles.topRow}><Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text} /></Pressable><Text style={styles.topTitle}>Detalhes do lugar</Text><Pressable accessibilityRole="button" accessibilityLabel="Editar lugar" onPress={() => navigation.navigate("Cadastro", { id: place.id })} style={styles.edit}><Ionicons name="create-outline" size={19} color={colors.primary} /></Pressable></View>
      <View style={styles.cover}>
        {place.photoUri ? <Image source={{ uri: place.photoUri }} style={styles.coverImage} /> : <View style={styles.coverPlaceholder}><Ionicons name="image-outline" size={34} color={colors.primary} /><Text style={styles.coverHint}>Uma lembrança esperando para ser registrada</Text></View>}
        <View style={styles.coverShade} /><View style={styles.coverContent}><StatusBadge status={place.status} compact /><Text style={styles.title}>{place.name}</Text><View style={styles.cityRow}><Ionicons name="location" size={15} color={colors.primary} /><Text style={styles.city}>{place.city}, {place.state}</Text></View></View>
      </View>
      <View style={styles.section}><Text style={styles.sectionLabel}>SOBRE ESTE LUGAR</Text><Text style={styles.description}>{place.description || "Nenhuma descrição foi adicionada."}</Text></View>
      <View style={styles.addressCard}><View style={styles.addressIcon}><Ionicons name="navigate-outline" size={18} color={colors.primary} /></View><View style={styles.addressCopy}><Text style={styles.sectionLabel}>ENDEREÇO</Text><Text style={styles.address}>{fullAddress(place)}</Text><Text style={styles.coordinates}>{place.latitude.toFixed(5)}° · {place.longitude.toFixed(5)}°</Text></View></View>
      <View style={styles.section}><View style={styles.mapHeader}><View><Text style={styles.sectionLabel}>NO MAPA</Text><Text style={styles.sectionTitle}>Este é o seu destino</Text></View><Ionicons name="map-outline" size={18} color={colors.primary} /></View><MapSurface places={[place]} currentLocation={null} compact /></View>
      {place.status !== "Visitado" ? <ActionButton title="Marcar como Visitado" icon="checkmark-circle-outline" onPress={markVisited} /> : <View style={styles.visitedNote}><Ionicons name="checkmark-circle" size={18} color={colors.primary} /><Text style={styles.visitedText}>Este lugar já faz parte das suas memórias.</Text></View>}
      <ActionButton title="Editar lugar" icon="create-outline" onPress={() => navigation.navigate("Cadastro", { id: place.id })} variant="secondary" />
      <ActionButton title="Remover do diário" icon="trash-outline" onPress={() => void handleRemove()} variant="danger" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: { gap: 18 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 13 },
  back: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  edit: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  topTitle: { flex: 1, color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
  cover: { minHeight: 280, borderRadius: 26, overflow: "hidden", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, position: "relative" },
  coverImage: { width: "100%", height: 280, resizeMode: "cover" },
  coverPlaceholder: { height: 280, alignItems: "center", justifyContent: "center", gap: 10 },
  coverHint: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10 },
  coverShade: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#0E162866" },
  coverContent: { position: "absolute", left: 20, right: 20, bottom: 20, alignItems: "flex-start", gap: 9 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 25 },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  city: { color: colors.text, fontFamily: fonts.medium, fontSize: 11 },
  section: { gap: 10 },
  sectionLabel: { color: colors.subtle, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 1.7 },
  sectionTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14, marginTop: 4 },
  description: { color: colors.muted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 20 },
  addressCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 15, backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: colors.border },
  addressIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#2EC4B61A", alignItems: "center", justifyContent: "center" },
  addressCopy: { flex: 1, gap: 5 },
  address: { color: colors.text, fontFamily: fonts.medium, fontSize: 11, lineHeight: 17 },
  coordinates: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9 },
  mapHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  visitedNote: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, borderRadius: 15, backgroundColor: "#2EC4B614", borderWidth: 1, borderColor: "#2EC4B633" },
  visitedText: { color: colors.primary, fontFamily: fonts.medium, fontSize: 10 },
});
