import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import * as Location from "expo-location";
import { ActionButton } from "@/src/components/ActionButton";
import { PhotoField } from "@/src/components/PhotoField";
import { ScreenShell } from "@/src/components/ScreenShell";
import { usePlaces } from "@/src/context/PlacesContext";
import { geocodeAddress } from "@/src/lib/geocoding";
import type { PlaceDraft, PlaceStatus } from "@/src/types/place";
import { colors, fonts } from "@/src/theme/colors";
import type { RootStackParamList } from "@/src/navigation/types";

type FormValues = { name: string; description: string; street: string; number: string; city: string; state: string; status: PlaceStatus; photoUri: string | null };
const blank: FormValues = { name: "", description: "", street: "", number: "", city: "", state: "", status: "Quero visitar", photoUri: null };

export default function PlaceFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Cadastro">>();
  const editingId = route.params?.id;
  const { isLoaded, storageError, findPlace, savePlace } = usePlaces();
  const existing = editingId ? findPlace(editingId) : undefined;
  const [formOverride, setFormOverride] = useState<FormValues | null>(null);
  const form = formOverride ?? (existing ? { name: existing.name, description: existing.description, street: existing.street, number: existing.number, city: existing.city, state: existing.state, status: existing.status, photoUri: existing.photoUri } : blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setFormOverride((current) => ({ ...(current ?? form), [key]: value }));

  const handleSave = async () => {
    setError(null);
    if (!form.name.trim() || !form.street.trim() || !form.number.trim() || !form.city.trim() || !form.state.trim()) {
      setError("Preencha nome, rua, número, cidade e estado para salvar o lugar.");
      return;
    }
    const enderecoCompleto = `${form.street.trim()}, ${form.number.trim()}, ${form.city.trim()}, ${form.state.trim()}, Brasil`;
    setSaving(true);
    try {
      if (Platform.OS !== "web") {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          setError("A permissão de localização foi negada. Ela é necessária para converter o endereço em coordenadas e cadastrar o lugar.");
          return;
        }
      }
      const coordinates = await geocodeAddress(enderecoCompleto);
      if (!coordinates || !Number.isFinite(coordinates.latitude) || !Number.isFinite(coordinates.longitude)) {
        setError("Não encontramos esse endereço. Confira os dados; nenhum lugar foi cadastrado sem coordenadas.");
        return;
      }
      const draft: PlaceDraft = {
        ...(editingId ? { id: editingId } : {}),
        ...form,
        name: form.name.trim(), description: form.description.trim(), street: form.street.trim(), number: form.number.trim(), city: form.city.trim(), state: form.state.trim(),
        latitude: coordinates.latitude, longitude: coordinates.longitude,
      };
      await savePlace(draft);
      navigation.goBack();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível localizar ou salvar o endereço. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return <ScreenShell><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Carregando lugar…</Text></ScreenShell>;
  }
  if (storageError) {
    return <ScreenShell><Text style={styles.title}>Diário indisponível</Text><Text style={styles.errorText}>{storageError}</Text><ActionButton title="Voltar" icon="arrow-back" onPress={() => navigation.goBack()} variant="outline" /></ScreenShell>;
  }
  if (editingId && !existing) {
    return <ScreenShell><Text style={styles.title}>Lugar não encontrado</Text><ActionButton title="Voltar" icon="arrow-back" onPress={() => navigation.goBack()} variant="outline" /></ScreenShell>;
  }

  return (
    <ScreenShell contentContainerStyle={styles.shell}>
      <View style={styles.topRow}><Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.text} /></Pressable><View style={styles.heading}><Text style={styles.eyebrow}>{editingId ? "ATUALIZE A LEMBRANÇA" : "GUARDE UM NOVO DESTINO"}</Text><Text style={styles.title}>{editingId ? "Editar lugar" : "Novo lugar"}</Text></View><View style={styles.spacer} /></View>
      <View style={styles.intro}><Ionicons name="navigate-outline" size={17} color={colors.primary} /><Text style={styles.introText}>Um endereço completo ajuda a encontrar o lugar no mapa.</Text></View>

      <Field label="Nome do lugar *" value={form.name} onChangeText={(value) => setField("name", value)} placeholder="Ex.: Jardim Botânico" autoCapitalize="words" />
      <Field label="Descrição" value={form.description} onChangeText={(value) => setField("description", value)} placeholder="O que você quer lembrar sobre esse lugar?" multiline />
      <Field label="Rua / avenida *" value={form.street} onChangeText={(value) => setField("street", value)} placeholder="Ex.: Rua dos Pinheiros" autoCapitalize="words" />
      <View style={styles.inlineFields}><View style={styles.numberField}><Field label="Número *" value={form.number} onChangeText={(value) => setField("number", value)} placeholder="120" keyboardType="number-pad" /></View><View style={styles.cityField}><Field label="Cidade *" value={form.city} onChangeText={(value) => setField("city", value)} placeholder="São Paulo" autoCapitalize="words" /></View></View>
      <Field label="Estado (UF) *" value={form.state} onChangeText={(value) => setField("state", value.toUpperCase().slice(0, 2))} placeholder="SP" autoCapitalize="characters" maxLength={2} />

      <View style={styles.group}><Text style={styles.label}>Status da visita</Text><View style={styles.statusRow}>{(["Quero visitar", "Visitado"] as PlaceStatus[]).map((status) => {
        const selected = form.status === status;
        return <Pressable key={status} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setField("status", status)} style={[styles.statusOption, selected && styles.statusSelected]}><Ionicons name={status === "Visitado" ? "checkmark-circle-outline" : "bookmark-outline"} size={16} color={selected ? colors.primary : colors.muted} /><Text style={[styles.statusText, selected && styles.statusTextSelected]}>{status}</Text></Pressable>;
      })}</View></View>

      <View style={styles.group}><Text style={styles.label}>Foto do lugar</Text><PhotoField value={form.photoUri} onChange={(uri) => setField("photoUri", uri)} /></View>
      {error ? <View accessibilityRole="alert" style={styles.errorBox}><Ionicons name="alert-circle-outline" size={18} color={colors.danger} /><Text style={styles.errorText}>{error}</Text></View> : null}
      <View style={styles.saveNote}><Ionicons name="map-outline" size={15} color={colors.accent} /><Text style={styles.noteText}>O endereço será convertido em latitude e longitude antes de salvar.</Text></View>
      <ActionButton title={saving ? "Localizando endereço…" : editingId ? "Salvar alterações" : "Salvar lugar"} icon={saving ? undefined : "checkmark"} loading={saving} onPress={() => void handleSave()} />
    </ScreenShell>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType, autoCapitalize, maxLength }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; keyboardType?: "default" | "number-pad"; autoCapitalize?: "none" | "sentences" | "words" | "characters"; maxLength?: number }) {
  return <View style={styles.group}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.subtle} multiline={multiline} keyboardType={keyboardType} autoCapitalize={autoCapitalize ?? "sentences"} maxLength={maxLength} style={[styles.input, multiline && styles.multiline]} textAlignVertical={multiline ? "top" : "center"} /></View>;
}

const styles = StyleSheet.create({
  shell: { gap: 17 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 13 },
  back: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  heading: { flex: 1 },
  spacer: { width: 16 },
  eyebrow: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 8, letterSpacing: 1.6 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: 22, marginTop: 4 },
  loadingText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, textAlign: "center" },
  intro: { flexDirection: "row", alignItems: "center", gap: 9, padding: 12, borderRadius: 15, backgroundColor: "#2EC4B614", borderWidth: 1, borderColor: "#2EC4B633" },
  introText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, flex: 1, lineHeight: 16 },
  group: { gap: 8 },
  label: { color: colors.text, fontFamily: fonts.medium, fontSize: 11 },
  input: { minHeight: 49, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, color: colors.text, fontFamily: fonts.regular, fontSize: 12 },
  multiline: { minHeight: 92, paddingTop: 13, paddingBottom: 13 },
  inlineFields: { flexDirection: "row", gap: 12 },
  numberField: { width: "32%" },
  cityField: { flex: 1 },
  statusRow: { flexDirection: "row", gap: 10 },
  statusOption: { flex: 1, minHeight: 48, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  statusSelected: { borderColor: colors.primary, backgroundColor: "#2EC4B61A" },
  statusText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 10 },
  statusTextSelected: { color: colors.primary },
  errorBox: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 13, backgroundColor: "#EF777718", borderColor: "#EF777744", borderWidth: 1, borderRadius: 15 },
  errorText: { flex: 1, color: colors.danger, fontFamily: fonts.medium, fontSize: 10, lineHeight: 16 },
  saveNote: { flexDirection: "row", alignItems: "center", gap: 8 },
  noteText: { color: colors.subtle, fontFamily: fonts.regular, fontSize: 9, flex: 1, lineHeight: 14 },
});
