import { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library/legacy";
import { colors, fonts } from "@/src/theme/colors";
import { CameraModal } from "@/src/components/CameraModal";

export function PhotoField({ value, onChange }: { value: string | null; onChange: (uri: string | null) => void }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const choosePhoto = async () => {
    setError(null);
    setWorking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError("A permissão da galeria foi negada. Ative o acesso às fotos nas configurações do dispositivo.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.85,
      });
      if (result.canceled || !result.assets?.[0]) return;
      let uri = result.assets[0].uri;
      if (result.assets[0].assetId && Platform.OS !== "web") {
        try {
          const asset = await MediaLibrary.getAssetInfoAsync(result.assets[0].assetId);
          uri = asset.localUri ?? asset.uri ?? uri;
        } catch {
          // Mantém o URI retornado pelo ImagePicker quando o assetId não pode ser resolvido.
        }
      }
      onChange(uri);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível abrir a galeria. Tente novamente.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewWrap}>
        {value ? <Image source={{ uri: value }} style={styles.preview} /> : <View style={styles.placeholder}><Ionicons name="images-outline" size={32} color={colors.primary} /><Text style={styles.placeholderText}>Uma lembrança visual deixa a viagem ainda mais sua.</Text></View>}
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" disabled={working} onPress={() => { setError(null); setCameraOpen(true); }} style={styles.photoButton}>
          <Ionicons name="camera-outline" size={17} color={colors.primary} /><Text style={styles.buttonText}>Tirar foto</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={working} onPress={() => void choosePhoto()} style={styles.photoButton}>
          <Ionicons name="images-outline" size={17} color={colors.primary} /><Text style={styles.buttonText}>{working ? "Abrindo…" : "Galeria"}</Text>
        </Pressable>
      </View>
      {value ? <Pressable accessibilityRole="button" disabled={working} onPress={() => onChange(null)} style={styles.removeButton}><Ionicons name="trash-outline" size={16} color={colors.danger} /><Text style={styles.removeText}>Remover foto</Text></Pressable> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <CameraModal visible={cameraOpen} onClose={() => setCameraOpen(false)} onCaptured={(uri, warning) => { onChange(uri); setError(warning ?? null); setCameraOpen(false); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  previewWrap: { height: 190, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" },
  preview: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 24 },
  placeholderText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 11, textAlign: "center", lineHeight: 18 },
  actions: { flexDirection: "row", gap: 10 },
  photoButton: { flex: 1, minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised },
  buttonText: { color: colors.text, fontFamily: fonts.medium, fontSize: 12 },
  removeButton: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 14, borderWidth: 1, borderColor: "#EF777744", backgroundColor: "#EF77770D" },
  removeText: { color: colors.danger, fontFamily: fonts.medium, fontSize: 11 },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 11, lineHeight: 17 },
});
